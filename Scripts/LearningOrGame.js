let IsLearningModeClicked = true;

$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  
    $("#leaderboardOption").click(function () {
      window.location.href = "../HTML/rank.html";
    });


    $("#dataOption").click(function () {
      window.location.href = "../HTML/dataTemplate.html";
    });


    $("#learningOptions").click(function () {
        localStorage.setItem("IsLearningMode", IsLearningModeClicked);
        window.location.href = "../HTML/levelOption.html";
        
    });
    $("#gameOptions").click(function () {
      IsLearningModeClicked = false;
      localStorage.setItem("IsLearningMode", IsLearningModeClicked);
      window.location.href = "../HTML/levelOption.html";
  });

  $(".profile").click(function () {
    window.location.href = "../HTML/profile.html";
  });
});