let listOfKanjiLevels;

// fetch kanji list
window.onload = getKanjiList;

$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  $(".profile").click(function () {
    window.location.href = "../HTML/profile.html";
  });
});
/**
 * fetch kanji list from local storage
 */
function getKanjiList() {
  let kanjiList = localStorage.getItem("Grade");
  kanjiList = JSON.parse(kanjiList);
  splitlevels(kanjiList);
}

/**
 * split the levels by 10 words in each level
 * @param {*} data
 */
function splitlevels(data) {
  try {
    listOfKanjiLevels = splitObjectIntoArrays(data, 10);
    const numberOfLevels = listOfKanjiLevels.length;
    let playerProgress = getPlayerProgress();
    generateLevelButtons(listOfKanjiLevels, playerProgress);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * get player progress stored in localStorage
 * @returns
 */
function getPlayerProgress() {
  console.log("reach here....");
  let playerList = JSON.parse(localStorage.getItem("Players")) || [];
  let playerID = JSON.parse(localStorage.getItem("CurrentUser")).id;
  let player = findPlayerByID(playerID, playerList);

  let currentGrade = parseInt(localStorage.getItem("grade"));
  let isLearningMode = localStorage.getItem("IsLearningMode");
  let currentMode = isLearningMode == "true" ? "learning" : "game";

  if (player!= null) {
    let player_progress = player.PlayerProgress;

        // Find level based on grade and mode
        let level = 0;
        if (currentMode === "learning") {
            // Find level in learndata
            for (let entry of player_progress[1].learndata) {
                if (parseInt(entry.grade) === currentGrade) {
                    level = entry.level;
                    break; // Exit loop once the level is found
                }
            }
        } else {
            // Find level in gamedata
            for (let entry of player_progress[0].gamedata) {
                if (parseInt(entry.grade) === currentGrade) {
                    level = entry.level;
                    break; // Exit loop once the level is found
                }
            }
        }
        return level;
    } else {
      return 0;
    }
  } 


function findPlayerByID(id, players) {
  for (let i = 0; i < players.length; i++) {
    for (let key in players[i]) {
      if (key === id) {
        // Return the player information associated with the ID
        return players[i][key]; // return progress information
      }
    }
  }
  // If ID is not found, return null
  return null;
}

/**
 * split the levels by 10 words in each level
 * @param {*} obj
 * @param {*} size
 * @returns
 */
function splitObjectIntoArrays(obj, size) {
  const keys = Object.keys(obj);
  const result = [];
  for (let i = 0; i < keys.length; i += size) {
    const currentLevel = keys.slice(i, i + size).map((key) => obj[key]);

    // Check if the last level has fewer than 5 words
    if (
      i + size >= keys.length &&
      currentLevel.length < 5 &&
      result.length > 0
    ) {
      // Append the remaining words to the previous level
      result[result.length - 1] =
        result[result.length - 1].concat(currentLevel);
    } else {
      result.push(currentLevel);
    }
  }
  return result;
}

/**
 * make levels buttons for each level
 * @param {*} listOfKanjiLevels
 * @param {*} playerprogress
 */
function generateLevelButtons(levels, playerProgress) {
  const buttonContainer = $("#level_options");
  // buttonContainer.style.display = "block";
  levels.forEach((level, index) => {
    var button = $(
      `<p class="level"><span>Level ${index + 1}</span><i></i></p>`
    );
    button.addClass("disabled");
    // level lock mechanism
    if (index > playerProgress) {
      button.addClass("disabled");
    } else {
      button.removeClass("disabled");
    }
    button.on("click", () => {
      handleButtonClick(index, level); // Handle button click event
    });
    buttonContainer.append(button);
  });
}

/**
 * handle level button click
 * @param {*} level
 */
function handleButtonClick(index, level) {
  // Store player's progress in local storage
  let learningMode = localStorage.getItem("IsLearningMode");
  localStorage.setItem("level", JSON.stringify(level));
  localStorage.setItem("level index", index); // initialize player progress index in local storage
  if (learningMode == "true") {
    localStorage.setItem("learning mode level", index); // initialize player's learning level in local storage
    window.location.href = "../HTML/learningTemplate.html";
  } else {
    localStorage.setItem("Game mode level", index); // initialize player's game level in local storage
    window.location.href = "../HTML/gameTemplate.html";
  }
}
