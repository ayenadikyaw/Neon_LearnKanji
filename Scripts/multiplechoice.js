let kanjis;
let meanings = [];
let index = 0;
let selectedKanjiIndex = [];
let correctAnswer;
let correctCnt = 0;
let score = 0;
let isMatchingDone = false;
const scoreTreshold = 7;
let isReady = false;
//const points = 10;
/**
 * fetch kanji from local storage
 */
window.onload = function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  fetchKanjis();
  collectMeanings(kanjis);
};

$(document).ready(function () {
  $(".answers").click(function () {
    index += 1;
    var clickedButton = $(this);
    let userAns = clickedButton.find("span").text();
    // $(".answers").not(clickedButton).prop("disabled", true);
    checkAnswer(userAns, correctAnswer, clickedButton);
  });

});

/**
 * fetch kanji of clicked level from local storage
 */
function fetchKanjis() {
  kanjis = localStorage.getItem("level");
  kanjis = JSON.parse(kanjis);

}

/**
 * fetch each word's meaning from api
 * @param {*} kanjis
 */
async function collectMeanings(kanjis) {
  const keys = Object.keys(kanjis);
  const fetchPromises = [];
  // Show the "data is still fetching" message
  $("#QuesBox").text("Please wait ....");

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
    $("#QuesBox").text("Data loaded successfully! Ready to start....");
    prepareMCQ(index);

    // Show the button container
    $("#buttons").show();
  } catch (error) {
    // Handle errors here if necessary
    console.error("One or more fetch operations failed:", error);
  }
}

/**
 * shuffle the kanji words with indexes
 */
function randomArragneKanjis() {
  // randomly generate kanji indexes
  while (selectedKanjiIndex.length < kanjis.length) {
    let rand = Math.floor(Math.random() * kanjis.length);
    if (!selectedKanjiIndex.includes(rand)) {
      selectedKanjiIndex.push(rand);
    }
  }
}

/**
 * functuion to prepare the quiz questions
 * @param {*} index
 */
async function prepareMCQ(index) {
  //await collectMeanings(kanjis);
  randomArragneKanjis();
  let question =
    "Choose the correct meaning of the given kanji " +
    kanjis[selectedKanjiIndex[index]];
  let choice1, choice2;
  if (meanings.length == kanjis.length) {
    correctAnswer = await meanings[selectedKanjiIndex[index]][0];

    // Fetch choice 1
    const rand1 = await getRandomIndex([index]);
    choice1 = await meanings[selectedKanjiIndex[rand1]][0];

    // Fetch choice 2
    const rand2 = await getRandomIndex([index, rand1]);
    choice2 = await meanings[selectedKanjiIndex[rand2]][0];
  }

  makeQuestion(question, correctAnswer, choice1, choice2);
}

/**
 * function to get random indexs for answer choices
 * @param {*} excludeIndexes
 * @returns
 */
async function getRandomIndex(excludeIndexes) {
  let rand;
  while (true) {
    rand = Math.floor(Math.random() * kanjis.length);
    if (!excludeIndexes.includes(rand)) {
      return rand;
    }
  }
}

/**
 * display the question and answer choices
 * @param {*} question
 * @param {*} answer
 * @param {*} choice1
 * @param {*} choice2
 */
function makeQuestion(question, answer, choice1, choice2) {
  var randomPlace = Math.floor(Math.random() * 3);
  $("#QuesBox").text(question);
  switch (randomPlace) {
    case 0:
      $("#left").text(answer);
      $("#middle").text(choice1);
      $("#right").text(choice2);
      break;
    case 1:
      $("#left").text(choice1);
      $("#middle").text(answer);
      $("#right").text(choice2);
      break;
    case 2:
      $("#left").text(choice1);
      $("#middle").text(choice2);
      $("#right").text(answer);
      break;
  }
}

/**
 * to check if user anwer is correct or not
 * @param {*} ans
 */
function checkAnswer(ans, correctAnswer, button) {
  console.log(ans, correctAnswer);
  if (ans == correctAnswer) {
    correctCnt += 1;

    // $("#cross").hide().removeClass("animate");
    // setTimeout(() => {
    //   $("#tick").show().addClass("animate");
    // }, 100);
    button
    .children()
    .css(
      "box-shadow",
      "0 0 10px #4dff03, 0 0 30px #4dff03, 0 0 50px #4dff03"
    );

    moveToNext(button);
  } else {
    // $("#tick").hide().removeClass("animate");
    // setTimeout(() => {
    //   $("#cross").show().addClass("animate");
    // }, 100);

      button
        .children()
        .css(
          "box-shadow",
          "0 0 10px #e91818, 0 0 30px #e91818, 0 0 50px #e91818"
        );
  

    moveToNext(button);
  }
  //moveToNext();
}

function moveToNext(button) {
  setTimeout(() => {
    button.children().css("box-shadow", "none");
  }, 1000);

  if (index < kanjis.length) {
    setTimeout(() => {
      $("#tick").hide();
      $("#cross").hide();
      prepareMCQ(index);
    }, 1500);

    //$(".answers").not(clickedButton).prop("disabled", false);
  } else {
    let playerScore = calculateScore(correctCnt);
    localStorage.setItem("percentage", playerScore);
    localStorage.setItem("correctAnswer", correctCnt);
    if (correctCnt == 10) {
      setTimeout(() => {
        window.location.href = "../HTML/ending10Points.html";
      }, 1000);
      storePlyaerProgress();
    } else if (correctCnt >= 1 && correctCnt <= 6) {
      setTimeout(() => {
        window.location.href = "../HTML/ending1to6Points.html";
      }, 1000);
    } else if (correctCnt >= 7 && correctCnt <= 9) {
      setTimeout(() => {
        window.location.href = "../HTML/ending7to9Points.html";
      }, 1000);
      storePlyaerProgress();
    } else {
      console.log("Invalid correct");
    }
  }
}
/**
 * to calculate score
 * @returns
 */
function calculateScore(count) {
  let score = (count / kanjis.length) * 100;
  return score;
}

/**
 * store player progress information
 */
function storePlyaerProgress() {
  let playerID = JSON.parse(localStorage.getItem("CurrentUser")).id;
  //let playerID = "ID" + ID;

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
  //let game = {};
  
  // find player info
  let player = findPlayerByID(playerID, players);
  if (player != null) {
    let newEntry = { grade: grade, level: level+1, mode: "game" };
    appendOrUpdateData(player.PlayerProgress, newEntry);
    currentPoints = parseInt(player.PlayerProgress[2].rankPoints);
    player.PlayerProgress[2] = { rankPoints: currentPoints + correctCnt };
  } else {
    let player = {};
    let gamedata = { grade: grade, level: level+1, mode: mode };
    player[playerID] = {
      PlayerProgress: [
        { gamedata: [gamedata] },
        { learndata: [] },
        { rankPoints: correctCnt },
      ],
    };
    players.push(player);
    //localStorage.setItem("Players", JSON.stringify(players));
  }
  localStorage.setItem("Players", JSON.stringify(players));
}

/**
 * find the player is in player database
 * @param {*} id 
 * @param {*} players 
 * @returns 
 */
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
