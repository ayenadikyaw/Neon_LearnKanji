//let userid = 0;

$(document).ready(function () {
  // Retrieve user database array from local storage or initialize it if it doesn't exist
  var userDatabase = JSON.parse(localStorage.getItem("userDatabase")) || [];
  var userid = userDatabase.length;
  console.log(userid);
 

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
    if(userDatabase.find((user) => user.email === email)){
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

  $("#confirmPassword").change(function () {
    var confirmPassword = $(this).val();
    var password = $("#password").val();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
    }
  });

  $("#registrationForm").submit(function (event) {
    event.preventDefault(); // Prevent form submission

    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    // Check if username, email, and password are already validated
    var usernameExists = userDatabase.find(
      (user) => user.username === username
    );
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    var passwordsMatch = password === confirmPassword;
    var mailExisted = userDatabase.find((user) => user.email === email);

    if (usernameExists || !validEmail || !strongPassword || !passwordsMatch || mailExisted) {
      alert("Something went wrong! Please try again!")
      return; // Do not proceed with form submission
    }
    
    // Add new user to the user database
    userDatabase.push({
      userid: "ID"+(++userid),
      username: username,
      email: email,
      password: password,
    });

    // Update user database in local storage
    localStorage.setItem("userDatabase", JSON.stringify(userDatabase));

    alert("Registration successful! You can now log in.");
  });
});
