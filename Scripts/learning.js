let currentState = 0; // to navigate to next or back
let kanjis;
let currentPoints = 0; // initial rank points
const points = 10; // points of one rank point
let kun_readings;
let isGenerateButtonClick = false;
/**
 * fetch kanji from local storage
 */

$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);

  fetchKanjis();
  //$("#back").hide();
  function fetchKanjis() {
    kanjis = localStorage.getItem("level");
    kanjis = JSON.parse(kanjis);
    displayKanjiFlashCard(kanjis, currentState);
  }

  /**
   * fetch data of kanji word from api
   * @param {*} kanjis
   * @param {*} currentState
   */
  async function displayKanjiFlashCard(kanjis, currentState) {
    let word = kanjis[currentState].toString();
    $("#kanji").text(word);
    let url = "https://kanjiapi.dev/v1/kanji/" + word;
    //console.log(url);
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.kun_readings.length > 5) {
          kun_readings = data.kun_readings.slice(0, 5);
        }
        $("#meaning").text(data.meanings[0]);
        $("#kunyomi").text(kun_readings);
        $("#onyomi").text(data.on_readings);
        $("#stroke").text(data.stroke_count);
        displayKanjiVideo(word);
      })
      .catch((error) => console.log(error));
  }

  /**
   * fetch kanji video
   * @param {*} kanjiWord
   */
  async function displayKanjiVideo(kanjiWord) {
    const url =
      "https://kanjialive-api.p.rapidapi.com/api/public/kanji/" + kanjiWord;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "a5343ce928mshe32d45956477859p1b1634jsnba983eed9fe9",
        "X-RapidAPI-Host": "kanjialive-api.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const videoURL = JSON.parse(result).kanji.video.mp4;
      const svgURL = JSON.parse(result).kanji.video.poster;

      $("#kanjiVid").html(`<video width="320" height="240" controls>
      <source src="${videoURL}" type="video/mp4"> 
      Your browser does not support the video tag.
  </video>`);
      $(".kanji_IMG").html(
        `<object type="image/svg+xml" data="${svgURL}" class="kanji_image" style="filter: invert(100%);"></object>`
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * for kanji sound
   * @param {*} word
   */
  function playSound(word) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.lang = "ja-JP"; // Set language to Japanese
    utterance.text = word;

    // Speak
    window.speechSynthesis.speak(utterance);
  }

  // chat gpt api link
  const url = "https://chatgpt-42.p.rapidapi.com/gpt4";
  /**
   * to generate example sentences of kanji
   * @param {*} kanjiWord
   */
  async function generateExampleSentences(kanjiWord, callback) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "ec47961e74msh944ac542fab6cbap13f738jsn567dc3f1a211",
        "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content:
              "Please generate 1 simple, short and easy to understand sentence using japanese kanji word" +
              kanjiWord +
              " in the format: Example Sentence: your example sentence in one line, Pronounciation: your prounciation in one line, Translation: your translation in one line. Thanks.",
          },
        ],
        web_access: false,
      }),
    };
    //overlay loading starts
    $("#loadingOverlay").show();
    $(".spinner").css("display", "block");
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const data = JSON.parse(result);
      const responseText = data["result"];
      console.log(data["result"]);

      const regex =
        /Example Sentence: ([^\n]+)\nPronunciation: ([^\n]+)\nTranslation: ([^\n]+)/;

      // Extracting Example Sentence, Pronunciation, and Translation
      const matches = responseText.match(regex);
      if (matches) {
        const exampleSentence = matches[1];
        const pronunciation = matches[2];
        const translation = matches[3];
        //overlay loading ends
        $("#loadingOverlay").hide();
        $("#example-sentences").html(
          `<p>${exampleSentence}</p>
          <p>${pronunciation}</p>
          <p>${translation}</p>
  
          `
        );

        if (typeof callback === "function") {
          callback();
        }
      } else {
        console.log("No match found.");
      }
    } catch (error) {
      console.error(error);
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
    // current logged in player's progress
    let grade = localStorage.getItem("grade");
    let level = Number(localStorage.getItem("level index"));
    let mode = "learning";
    //let learn = {};

    // find player info
    let player = findPlayerByID(playerID, players);
    if (player != null) {
      let newEntry = { grade: grade, level: level+1, mode: "learning" };
      appendOrUpdateData(player.PlayerProgress, newEntry);
      // // check grade existed
      // let player_progress = player.PlayerProgress; // learn data
      // console.log(player_progress);
      // let newEntry = { grade: grade, level: level, mode: "learning" };
      // let playerUpdateInfo = appendOrUpdateData(player_progress, newEntry);
      // player.PlayerProgress[1] = playerUpdateInfo;
      currentPoints = parseInt(player.PlayerProgress[2].rankPoints);
      player.PlayerProgress[2] = { rankPoints: currentPoints + points };
    } else {
      let player = {};
      let learndata = { grade: grade, level: level, mode: mode };
      player[playerID] = {
        PlayerProgress: [
          { gamedata: [] },
          { learndata: [learndata] },
          { rankPoints: points },
        ],
      };
      players.push(player);
      
    }
    localStorage.setItem("Players", JSON.stringify(players));
  }

  /**
   * find player by ID
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
  function appendOrUpdateData(PlayerProgress, newData, points) {
    // Check if learndata exists
     // Check if learndata exists
     if (PlayerProgress[1].learndata) {
      let existingEntryIndex = PlayerProgress[1].learndata.findIndex(entry => entry.grade === newData.grade && entry.mode === newData.mode);

      // If the grade doesn't exist or the new level is higher, append/update the new data
      if (existingEntryIndex === -1 || PlayerProgress[1].learndata[existingEntryIndex].level < newData.level) {
          if (existingEntryIndex === -1) {
              // If the grade doesn't exist, append the new data
              PlayerProgress[1].learndata.push(newData);
              console.log("New data appended to learndata");
          } else {
              // If the grade exists but the new level is higher, update the existing entry
              PlayerProgress[1].learndata[existingEntryIndex] = newData;
              console.log("Existing data updated in learndata");
          }
      } else {
          console.log("Level is not higher than the existing entry for the same grade and mode");
      }
      
      // Return only the learndata part
      return PlayerProgress;
  } else {
      console.log("Learndata does not exist");
      return null; // Return null if learndata doesn't exist
  }
  }

  $("#sound").click(function () {
    var kanjiWord = $(this).parent().find("#kanji").text();
    playSound(kanjiWord);
  });

  $("#next").click(function () {
    currentState += 1;
    if (currentState < kanjis.length) {
      displayKanjiFlashCard(kanjis, currentState);
    }

    if (isGenerateButtonClick) {
      generateExampleBackToNormal();
    }
    if (currentState === kanjis.length) {
      $("#next").hide();
      storePlyaerProgress();
      setTimeout(() => {
         window.location.href = "../HTML/LearningEndTemplate.html";
      }, 1000);
    }
  });

  // Generate example sentences animation
  $("#generate-btn").click(function () {
    isGenerateButtonClick = true;
    const kanjiWord = $("#kanji").text().trim();
    if (kanjiWord) {
      generateExampleSentences(kanjiWord, function () {
        $("#read_btn").slideUp(1000, function () {
          $("#read_btn").css("display", "none");
        });
        $(".read_txt").slideDown(1000, function () {
          $(".read_txt").css("display", "none");
        });
        $("#egTXT").slideUp(1000, function () {
          $("#egTXT").css("display", "none");
        });
        $("#show_txt").slideDown(4000, function () {
          $("#show_txt").css("display", "block");
        });
      });
    } else {
      console.log("No kanji word");
    }
  });

  $(".profile").click(function () {
    window.location.href = "../HTML/profile.html";
  });
});

function generateExampleBackToNormal() {
  $(".read_btn").slideUp(1000, function () {
    $(".read_btn").css("display", "block");
  });
  $(".read_txt").slideDown(1000, function () {
    $(".read_txt").css("display", "block");
  });
  $(".egTXT").slideUp(1000, function () {
    $(".egTXT").css("display", "block");
  });
  $(".show_txt").slideDown(4000, function () {
    $(".show_txt").css("display", "none");
  });
  $(".next_txt").slideDown(4000, function () {
    $(".next_txt").css("display", "none");
  });
}
