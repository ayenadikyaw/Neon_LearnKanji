let kanjis;
let meanings = [];
let index = 0;
let selectedKanjiIndex = [];
let score = 0;
let isMatchingDone = false;
const scoreTreshold = 70;
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
let matching_score;
let points = 10;

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
  //console.log(typeof kanjis, kanjis, kanjis[0]);
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
//============================================================================

/**
 * prepare matching game
 */
function prepareMatching() {
  console.log(kanjis);
  console.log(meanings);
  let kanji_ques = selectRandomCardsPos();
  let kanji_meanings = selectRandomCardsPos();
  console.log(kanji_ques);
  console.log(kanji_meanings);

  for (let i = 0; i < kanji_ques.length; i++) {
    correctPairs.push([kanjis[i], meanings[i][0]]);
  }
  console.log(correctPairs);
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
  for (var i = 0; i < parseInt(list.length/2); i++) {
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
  for (var i = parseInt(list.length/2); i <list.length; i++) {
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
    alert("You complete the game!");
    matching_score = calculateMatchingScore(
      matchingCorrectCount,
      matchingIncorrectCount
    );
    console.log(matching_score);
  }

  if (matching_score >= scoreTreshold) {
    alert("Level unlocked!");
    storePlyaerProgress();
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
  let score = ((correct - miss) / kanjis.length) * 100;
  return score;
}
