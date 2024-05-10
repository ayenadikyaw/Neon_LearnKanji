let IsLearningModeClicked = true;

$(document).ready(function () {
  let userProfile = JSON.parse(localStorage.getItem("CurrentUser")).firstLetter;
  $("#profile_txt").text(userProfile);
  
    $("#learningOptions").click(function () {
        localStorage.setItem("IsLearningMode", IsLearningModeClicked);
        window.location.href = "../HTML/levelOption.html";
        
    });
    $("#gameOptions").click(function () {
      IsLearningModeClicked = false;
      localStorage.setItem("IsLearningMode", IsLearningModeClicked);
      window.location.href = "../HTML/levelOption.html";
  });
});