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
        $("#show_alert").text(
          "Username already exists. Please enter a new username"
        );
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);

        //alert("Username already exists. Please choose a different one.");
      }
    });

    $("#signUpemail").change(function () {
      var email = $(this).val();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        $("#show_alert").text("Invalid email address.");
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);
      }
      if (userDatabase.find((user) => user.email === email)) {
        $("#show_alert").text(
          "This account already exists. Please choose a different one."
        );
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);
      }
    });

    $("#password").change(function () {
      var password = $(this).val();
      var strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPasswordRegex.test(password)) {
        $("#show_alert").text(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);
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
        $("#show_alert").text(
          "You need to agree on terms and conditions first!"
        );
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);
        return;
      }

      if (
        usernameExists ||
        !validEmail ||
        !strongPassword ||
        mailExisted ||
        !$("#check").prop("checked")
      ) {
        $("#show_alert").text("Something went wrong. Please try again!");
        $(".main_alert").addClass("show_A");
        setTimeout(() => {
          $(".main_alert").removeClass("show_A");
        }, 5000);
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

      $("#show_success").text(
        "Registration successful! You can now log in into our website."
      );
      $(".main_success").addClass("show_S");
      setTimeout(() => {
        $(".main_success").removeClass("show_S");

        $(".logreg-box").addClass("active");
        $("#username").val("");
        $("#signUpemail").val("");
        $("#password").val("");
        $("#level").val("");
        $("#check").prop("checked", false);
      }, 5000);
    });
  });

  // login starts
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    doSignInOperation(userDatabase);
  });

  $(".signin").click(function () {
    $(".logreg-box").removeClass("active");
  });
});

function doSignInOperation(userDatabase) {
  var email = $("#loginEmail").val();
  var password = $("#loginPsw").val();

  // Check if the username exists in the user database and the password matches
  var user = userDatabase.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
  
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
    $("#show_success").text("Login Successful! Welcome to our Neon Website!");
    $(".main_success").addClass("show_S");
    setTimeout(() => {
      $(".main_success").removeClass("show_S");
      window.location.href = "./start.html";
    }, 5000);
  
  } else {
    $("#show_alert").text("Accocunt or password does not match!");
    $(".main_alert").addClass("show_A");
    setTimeout(() => {
      $(".main_alert").removeClass("show_A");
    }, 5000);

    //reset
    $("#loginEmail").val("");
    $("#loginPsw").val("");
    $("#loginEmail").focus();
    $("#rememberMe").prop("checked", false);
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
