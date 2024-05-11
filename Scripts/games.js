$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  
  $("#MCQ").click(function () {
    localStorage.setItem("GameMode", "MCQ");
    window.location.href = "../HTML/multipleChoice.html";
  });

  $("#Matching").click(function () {
    localStorage.setItem("GameMode", "Matching");
    window.location.href = "../HTML/matchingGame.html";
  });
  
  $(".profile").click(function () {
    window.location.href = "../HTML/profile.html";
  });
});
