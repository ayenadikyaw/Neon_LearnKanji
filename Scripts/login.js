$(document).ready(function () {
  var storedUsername = getCookie('username');
  var storedPassword = getCookie('password');
  if (storedUsername && storedPassword) {
      // Autofill the login form with stored username and password
      document.getElementById('username').value = storedUsername;
      document.getElementById('password').value = storedPassword;
  }


    $('#feedbackButton').click(function() {
        var emailSubject = encodeURIComponent("Feedback"); // Encode subject
        var emailBody = encodeURIComponent("Type your feedback here..."); // Encode body
        var mailtoLink = "mailto:ayenadykyaw1@email.com?subject=" + emailSubject + "&body=" + emailBody;
        window.location.href = mailtoLink;
    });

  $("#loginForm").submit(function (event) {
    event.preventDefault(); // Prevent form submission

    var username = $("#username").val();
    var password = $("#password").val();
  
    // Retrieve user database array from local storage or initialize it if it doesn't exist
    var userDatabase = JSON.parse(localStorage.getItem("userDatabase")) || [];

    // Check if the username exists in the user database and the password matches
    var user = userDatabase.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      alert("Login successful!");
      firstLetter = username[0].toUpperCase();
      //let userid = parseInt(user.userid.substring(2));
      localStorage.setItem(
        "CurrentUser",
        JSON.stringify({
          id: user.userid,
          username: user.username,
          firstLetter: firstLetter,
        })
      );

    if($("#rememberMe").prop("checked")==true) {
      setCookie("username", username,30);
      setCookie("password", password,30);
    }else {
      // Clear any existing username and password cookies
      document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      document.cookie = 'password=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
  }

      window.location.href = "../HTML/start.html";
    } else {
      alert("Invalid username or password.");
    }
  });
});


// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
      }
  }
  return null;
}