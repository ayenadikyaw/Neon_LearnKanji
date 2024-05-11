let listOfKanjiLevels;
let playerProgress = 0;

/**
 * fetch kanji from kanji api by grade
 * @param {*} grade
 */
async function fetchKanji(grade) {
  try {
    $(".card").prop("disabled", true);
    $("#loadingOverlay").show();
    $(".spinner").css("display", "block");

    let url = "https://kanjiapi.dev/v1/kanji/grade-" + grade;
    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem("Grade", JSON.stringify(data));

    return data; // Return data after successful fetch
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate error to caller
  } finally {
    $("#loadingOverlay").hide();
    $(".card").prop("disabled", false);
  }
}

$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  $(".grades").click(function (event) {
     event.preventDefault();
    fetchKanji(this.id)
      .then(() => {
        localStorage.setItem("grade", this.id);
        window.location.href = "../HTML/LearningOrGame.html";
      })
      .catch((error) => console.log(error));
  });
  $(".profile").click(function () {
    window.location.href = "../HTML/profile.html";
  });
});
