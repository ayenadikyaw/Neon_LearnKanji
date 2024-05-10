let kanjis;
let meanings = [];
let index = 0;
let selectedKanjiIndex = [];
let correctAnswer;
let correctCnt = 0;
let score = 0;
let isMatchingDone = false;
const scoreTreshold = 70;
let isReady = false;
const points = 10 ; // rank points
/**
 * fetch kanji from local storage
 */
window.onload = function () {
  fetchKanjis();
  collectMeanings(kanjis);
};

$(document).ready(function () {
  $(".answers").click(function () {
    index += 1;
    var clickedButton = $(this);
    let userAns = clickedButton.find("span").text();
    // $(".answers").not(clickedButton).prop("disabled", true);
    checkAnswer(userAns, correctAnswer);
  });
});

/**
 * fetch kanji of clicked level from local storage
 */
function fetchKanjis() {
  kanjis = localStorage.getItem("level");
  //console.log(kanjis);
  kanjis = JSON.parse(kanjis);
  //console.log(typeof kanjis, kanjis, kanjis[0]);
}

/**
 * fetch each word's meaning from api
 * @param {*} kanjis
 */
async function collectMeanings(kanjis) {
  const keys = Object.keys(kanjis);
  const fetchPromises = [];
  // Show the "data is still fetching" message
  $("#QuesBox").text("Data is still fetching. Please wait ....");

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
    console.log(question, correctAnswer);
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
function checkAnswer(ans) {
  console.log(ans, correctAnswer);
  if (ans == correctAnswer) {
    correctCnt += 1;
    $("#cross").hide().removeClass("animate");
    setTimeout(() => {
      $("#tick").show().addClass("animate");
    }, 100);

    moveToNext();
  } else {
    $("#tick").hide().removeClass("animate");
    setTimeout(() => {
      $("#cross").show().addClass("animate");
    }, 100);
    moveToNext();
  }
  //moveToNext();
}

function moveToNext() {
  if (index < kanjis.length) {
    setTimeout(() => {
      $("#tick").hide();
      $("#cross").hide();
      prepareMCQ(index);
    }, 1500);

    //$(".answers").not(clickedButton).prop("disabled", false);
  } else {
    let playerScore = calculateScore(correctCnt);
    if (playerScore >= scoreTreshold) {
      setTimeout(() => {
        alert("level unlocked");
      }, 1000);

      storePlyaerProgress();
    } else {
      alert("Go back to learning page againg and try again");
    }
  }
}
/**
 * to calculate score
 * @returns
 */
function calculateScore(count) {
  score = (count / kanjis.length) * 100;
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
          PlayerProgress: [{ gamedata: {} }, { learndata: {} }],
        },
      },
    ];
  }
  // get current player info
  let grade = localStorage.getItem("grade");
  let level = Number(localStorage.getItem("level index")) + 1;
  let mode = "game";
  let game = {};
  game.gamedata = { grade: grade, level: level, mode: mode };
  // find player info
  let player = findPlayerByID(playerID, players);
  if (player != null) {
    player.PlayerProgress[0] = game;
    currentPoints = parseInt(player.PlayerProgress[2].rankPoints);
    player.PlayerProgress[2] = { rankPoints: currentPoints + points };
 
  } else {
    let player = {};
    let gamedata = { grade: grade, level: level, mode: mode };
    player[playerID] = {
      PlayerProgress: [
        { gamedata: gamedata },
        { learndata: {} },
        { rankPoints: points },
      ],
    };
    players.push(player);
    //localStorage.setItem("Players", JSON.stringify(players));
  }
  localStorage.setItem("Players", JSON.stringify(players));
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

