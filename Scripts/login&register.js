$(document).ready(function () {
  // Retrieve user database array from local storage or initialize it if it doesn't exist
  var userDatabase = JSON.parse(localStorage.getItem("userDatabase")) || [];
  var userid = userDatabase.length;
  console.log(userid);

  // Retrieve cookies
  var storedUsername = getCookie("email");
  var storedPassword = getCookie("password");
  if (storedUsername && storedPassword) {
    // Autofill the login form with stored username and password
    $("#loginEmail").val(storedUsername);
    $("#loginPsw").val(storedPassword);
  }

  //   // For Sign Up Section
  $(".signUp").click(function () {
    $(".logreg-box").addClass("active");
    $("#username").val("");
    $("#signUpemail").val("");
    $("#password").val("");
    $("#level").val("");

    $("#username").change(function () {
      var username = $(this).val();

      if (userDatabase.find((user) => user.username === username)) {
        alert("Username already exists. Please choose a different one.");
      }
    });

    $("#email").change(function () {
      var email = $(this).val();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        alert("Invalid email address.");
      }
      if (userDatabase.find((user) => user.email === email)) {
        alert("This account already exists. Please choose a different one.");
      }
    });

    $("#password").change(function () {
      var password = $(this).val();
      var strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPasswordRegex.test(password)) {
        alert(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }
    });

    $("#registrationForm").submit(function (event) {
      event.preventDefault(); // Prevent form submission

      var username = $("#username").val();
      var email = $("#signUpemail").val();
      var password = $("#password").val();
      var level = $("#level").val();


      // Check if username, email, and password are already validated
      var usernameExists = userDatabase.find(
        (user) => user.username === username
      );
      var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password
        );
      //var passwordsMatch = password === confirmPassword;
      var mailExisted = userDatabase.find((user) => user.email === email);

      if (!$("#check").prop("checked")) {
        alert("You need to agree on terms and conditions first!");
        return;
      }

      if (
        usernameExists ||
        !validEmail ||
        !strongPassword ||
        mailExisted ||
        !$("#check").prop("checked")
      ) {
        alert("Something went wrong! Please try again!");
        return; // Do not proceed with form submission
      }

      // Add new user to the user database
      userDatabase.push({
        userid: "ID" + ++userid,
        username: username,
        email: email,
        password: password,
        level: level,
      });

      // Update user database in local storage
      localStorage.setItem("userDatabase", JSON.stringify(userDatabase));

      alert("Registration successful! You can now log in.");
      $(".logreg-box").addClass("active");
      $("#username").val("");
      $("#signUpemail").val("");
      $("#password").val("");
      $("#level").val("");
    });
  });

  // login starts
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    console.log("clicked registration");
    doSignInOperation(userDatabase);
  });

  $(".signin").click(function () {
    $(".logreg-box").removeClass("active");
  });
});

function doSignInOperation(userDatabase) {
  var email = $("#loginEmail").val();
  var password = $("#loginPsw").val();
  console.log(email, password);

  // Check if the username exists in the user database and the password matches
  var user = userDatabase.find(
    (user) => user.email === email && user.password === password
  );
  console.log(user);
  if (user) {
    alert("Login successful!");
    firstLetter = user.username[0].toUpperCase();
    //let userid = parseInt(user.userid.substring(2));
    localStorage.setItem(
      "CurrentUser",
      JSON.stringify({
        id: user.userid,
        username: user.username,
        firstLetter: firstLetter,
      })
    );

    if ($("#rememberMe").prop("checked") == true) {
      setCookie("email", email, 30);
      setCookie("password", password, 30);
    } else {
      // Clear any existing username and password cookies
      document.cookie =
        "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      document.cookie =
        "password=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    window.location.href = "../HTML/start.html";
  } else {
    alert("Invalid username or password.");
    $("#loginEmail").val("");
    $("#loginPsw").val("");
    $("#loginEmail").focus();
  }
}

// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}
