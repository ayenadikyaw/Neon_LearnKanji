let kanjis;
let meanings = [];
let index = 0;
let selectedKanjiIndex = [];
let score = 0;
let isMatchingDone = false;
//const scoreTreshold = 70;
let isReady = false;
let clickedKanji = false;
let clickedMeaning = false;
let checkPair = {};
let clickedKanjiButtons = [];
let clickedMeanButtons = [];
let correctPairs = [];
let kanjiButtonID, meaningButtonID;
let pairCount = 0;
let matchingCorrectCount = 0;
let matchingIncorrectCount = 0;
let matching_score, matching_accuracy;
//let points = 10;

/**
 * fetch kanji from local storage
 */
window.onload = function () {
  fetchKanjis();
  collectMeanings(kanjis);
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
};

/**
 * fetch kanji of clicked level from local storage
 */
function fetchKanjis() {
  kanjis = localStorage.getItem("level");
  //console.log(kanjis);
  kanjis = JSON.parse(kanjis);
}

/**
 * fetch each word's meaning from api
 * @param {*} kanjis
 */
async function collectMeanings(kanjis) {
  const keys = Object.keys(kanjis);
  const fetchPromises = [];
  // to add overlay for waiting fetching time start
  $("#loadingOverlay").show();
  $(".spinner").css("display", "block");

  for (let i = 0; i < keys.length; i++) {
    let url = "https://kanjiapi.dev/v1/kanji/" + kanjis[keys[i]];
    const fetchPromise = await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let meaning = data.meanings;
        meanings.push(meaning);
      })
      .catch((error) => console.log(error));
    fetchPromises.push(fetchPromise);
  }
  try {
    // Wait for all fetch operations to complete
    await Promise.all(fetchPromises);
    console.log("All data fetched successfully!");

    //fetching done ( to stop overlay loading)
    $("#loadingOverlay").hide();

    prepareMatching();

    // Show the button container
    $("#buttons").show();
  } catch (error) {
    console.error("One or more fetch operations failed:", error);
  }
}

/**
 * store player progress information
 */
function storePlyaerProgress() {
  let playerID = JSON.parse(localStorage.getItem("CurrentUser")).id;

  let players = JSON.parse(localStorage.getItem("Players"));

 // initialize player object
 if (players == null) {
  players = [
    {
      ID1: {
        PlayerProgress: [
          { gamedata: [] },
          { learndata: [] },
          { rankPoints: 0 },
        ],
      },
    },
  ];
}
  // get current player info
  let grade = localStorage.getItem("grade");
  let level = Number(localStorage.getItem("level index"));
  let mode = "game";


  // find player info
  let player = findPlayerByID(playerID, players);
  if (player != null) {
    let newEntry = { grade: grade, level: level+1, mode: "game" };
    appendOrUpdateData(player.PlayerProgress, newEntry);
    currentPoints = parseInt(player.PlayerProgress[2].rankPoints);
    player.PlayerProgress[2] = { rankPoints: currentPoints + matching_score };
  } else {
    let player = {};
    let gamedata = { grade: grade, level: level+1, mode: mode };
    player[playerID] = {
      PlayerProgress: [
        { gamedata: [gamedata] },
        { learndata: [] },
        { rankPoints: matching_score },
      ],
    };
    players.push(player);
    //localStorage.setItem("Players", JSON.stringify(players));
  }
  localStorage.setItem("Players", JSON.stringify(players));
  //localSrotage.setItem("IsMatchingDone",true);
}

function findPlayerByID(id, players) {
  for (let i = 0; i < players.length; i++) {
    for (let key in players[i]) {
      if (key === id) {
        // Return the player information associated with the ID
        return players[i][key];
      }
    }
  }
  // If ID is not found, return null
  return null;
}

// Function to append or update data in the learndata array based on grade and level
function appendOrUpdateData(PlayerProgress, newData) {
  
   // Check if learndata exists
   if (PlayerProgress[0].gamedata) {
    let existingEntryIndex = PlayerProgress[0].gamedata.findIndex(entry => entry.grade === newData.grade && entry.mode === newData.mode);

    // If the grade doesn't exist or the new level is higher, append/update the new data
    if (existingEntryIndex === -1 || PlayerProgress[0].gamedata[existingEntryIndex].level < newData.level) {
        if (existingEntryIndex === -1) {
            // If the grade doesn't exist, append the new data
            PlayerProgress[0].gamedata.push(newData);
            console.log("New data appended to learndata");
        } else {
            // If the grade exists but the new level is higher, update the existing entry
            PlayerProgress[0].gamedata[existingEntryIndex] = newData;
            console.log("Existing data updated in learndata");
        } 
    } else {
        console.log("Level is not higher than the existing entry for the same grade and mode");
    }
  
    return PlayerProgress;
} else {
    console.log("Gamedata does not exist");
    return null; // Return null if learndata doesn't exist
}
}



//============================================================================

/**
 * prepare matching game
 */
function prepareMatching() {
  console.log(kanjis);
  console.log(meanings);
  let kanji_ques = selectRandomCardsPos();
  let kanji_meanings = selectRandomCardsPos();


  for (let i = 0; i < kanji_ques.length; i++) {
    correctPairs.push([kanjis[i], meanings[i][0]]);
  }

  generateCards(kanji_ques, "kanjis");
  generateCards(kanji_meanings, "meanings");

  // click event handler for kanji selection
  $("#container1").on("click", ".kanji", function () {
    var text = $(this).text();
    $(".kanji").not(this).prop("disabled", "true");
    kanjiButtonID = $(this).attr("id");
    if (clickedKanjiButtons.includes(kanjiButtonID)) {
      return;
    } else {
      clickedKanji = true;
      clickedKanjiButtons.push(kanjiButtonID);
      checkPair["kanji"] = text;
    }
    if (clickedKanji && clickedMeaning) {
      setTimeout(function () {
        checkMatchingPair();
      }, 1000);
    }
  });

  // Click event handler for meaning selection
  $("#container2").on("click", ".meaning", function () {
    var text = $(this).text();
    $(".meaning").not(this).prop("disabled", "true");

    meaningButtonID = $(this).attr("id");
    if (clickedMeanButtons.includes(meaningButtonID)) {
      return;
    } else {
      clickedMeaning = true;
      clickedMeanButtons.push(meaningButtonID);
      checkPair["meaning"] = text;
    }
    if (clickedKanji && clickedMeaning) {
      setTimeout(function () {
        checkMatchingPair();
      }, 1000);
    }
  });
}

/**
 * to locate the cards at random card positions
 * @returns card array
 */
function selectRandomCardsPos() {
  let indexNo = [];
  while (indexNo.length < kanjis.length) {
    var randomIndex = Math.floor(Math.random() * kanjis.length);
    if (indexNo.includes(randomIndex)) {
      continue;
    } else {
      indexNo.push(randomIndex);
    }
  }
  return indexNo;
}

/**
 * generate cards at random positions
 * @param {*} list
 * @param {*} name
 */
function generateCards(list, name) {
  for (var i = 0; i < parseInt(list.length / 2); i++) {
    word = name === "kanjis" ? kanjis[list[i]] : meanings[list[i]][0];
    if (name === "kanjis") {
      $("#leftkanji").append(`
      <div class="center">
          <div class="outer button">
            <button class="kanji" id="kanji${i}">${word}</button>
            <span></span>
            <span></span>
          </div>
        </div>
        <br />
      `);
    } else {
      $("#leftmeaning").append(`
      <div class="center">
      <div class="outer button">
        <button class="meaning" id="meaning${i}">${word}</button>
        <span></span>
        <span></span>
      </div>
    </div>
    <br />
      `);
    }
  }
  for (var i = parseInt(list.length / 2); i < list.length; i++) {
    word = name === "kanjis" ? kanjis[list[i]] : meanings[list[i]][0];
    if (name === "kanjis") {
      $("#rightkanji").append(`
      <div class="center">
          <div class="outer button">
            <button class="kanji" id="kanji${i}">${word}</button>
            <span></span>
            <span></span>
          </div>
        </div>
        <br />
      `);
    } else {
      $("#rightmeaning").append(`
      <div class="center">
      <div class="outer button">
        <button class="meaning" id="meaning${i}">${word}</button>
        <span></span>
        <span></span>
      </div>
    </div>
    <br />
      `);
    }
  }
}

/**
 * check matched pairs
 */
function checkMatchingPair() {
  let kanji = checkPair.kanji;
  let meaning = checkPair.meaning;
  let correctMeaning;
  for (var i = 0; i < correctPairs.length; i++) {
    if (correctPairs[i][0] === kanji) {
      correctMeaning = correctPairs[i][1];
      break;
    }
  }
  if (meaning === correctMeaning) {
    $(`#${kanjiButtonID}`).parent().addClass("zoomAnimate");
    $(`#${meaningButtonID}`).parent().addClass("zoomAnimate");
    $(`#${kanjiButtonID}`).css("visibility", "hidden");
    $(`#${meaningButtonID}`).css("visibility", "hidden");
    $(".kanji").prop("disabled", false);
    $(".meaning").prop("disabled", false);
    checkPair = [];
    pairCount += 2;
    matchingCorrectCount += 1;
  } else {
    $(`#${kanjiButtonID}`).parent().addClass("shakeAnimate");
    $(`#${meaningButtonID}`).parent().addClass("shakeAnimate");
    $(".kanji").prop("disabled", false);
    $(".meaning").prop("disabled", false);
    matchingIncorrectCount += 1;
  }

  if (pairCount == kanjis.length * 2) {
    //alert("You complete the game!");
    let player_score = calculateMatchingScore(
      matchingCorrectCount,
      matchingIncorrectCount
    );
    matching_accuracy = player_score[0];
    matching_score = player_score[1];
  }

  // if (matching_score >= scoreTreshold) {
  //   alert("Level unlocked!");
  //   storePlyaerProgress();
  // }
  localStorage.setItem("percentage", matching_accuracy);
  localStorage.setItem("correctAnswer", matching_score);
  if (matching_score == 10) {
    setTimeout(() => {
      window.location.href = "../HTML/ending10Points.html";
    }, 1000);
    storePlyaerProgress();
  } else if (matching_score >= 1 && matching_score <= 6) {
    setTimeout(() => {
      window.location.href = "../HTML/ending1to6Points.html";
    }, 1000);
  } else if (matching_score >= 7 && matching_score <= 9) {
    setTimeout(() => {
      window.location.href = "../HTML/ending7to9Points.html";
    }, 1000);
    storePlyaerProgress();
  } else {
    console.log("Invalid correct");
  }

  // reset
  clickedKanji = false;
  clickedMeaning = false;
  checkPair = {};
  clickedKanjiButtons = [];
  clickedMeanButtons = [];
}

/**
 * calculate score for each level
 * @param {*} correct
 * @param {*} miss
 * @returns
 */
function calculateMatchingScore(correct, miss) {
  let accuracy = parseInt((correct / (correct + miss)) * 100); // accuracy level
  let score = parseInt(correct * (correct / (correct + miss)));
  return [accuracy, score];
}
