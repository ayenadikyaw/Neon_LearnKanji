const users = JSON.parse(localStorage.getItem("userDatabase")) || {};
let isUpdate = false;
let notifications;

$(document).ready(function () {
notifications = $(".notifications");
  const playerID = JSON.parse(localStorage.getItem("CurrentUser")).id; // current user id
  const user = getPlayerById(playerID);
  if (user != null) {
    $("#username").val(user.username);
    $("#email").val(user.email);
    $("#password").val(user.password);
    $("#level").val(user.level);
  }

  $(".back_btn").click(function () {
    window.history.back();
  });

 
  $("#save").click(function () {
    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let level = $("#level").val();

    var strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if ((username != user.username)&&(!(users.find((user)=> user.username === username)))) {
      user.username = username;
      isUpdate = true;
    }
    if ((email != user.email) && (!users.find((user)=> user.email === email))) {
      user.email = email;
      isUpdate = true;
    }

    if (password != user.password && (!strongPasswordRegex.test(password))) {
      user.password = password;
      isUpdate = true;
    }
    if (level != user.level) {
      user.level = level;
      isUpdate = true;
    }

    
    updatePlayerInfo(user, playerID);

  });
});

/**
 * find player by ID in userDatabase
 * @param {*} id
 * @returns
 */
function getPlayerById(id) {
  // Check if there is any stored data
  if (users.length > 0) {
    const user = users.find((user) => user.userid === id);

    return user;
  } else {
    // If no data is stored, return null
    return null;
  }
}

function updatePlayerInfo(user, id) {
  let userIndex = users.findIndex((user) => user.userid === id);
  if (userIndex != -1) {
    users[userIndex] = user;
  }
  //console.log(users);
  localStorage.setItem("userDatabase", JSON.stringify(users));
 

  if(isUpdate){
    let currentUser = {
        "id": user.userid,
        "username": user.username,
        "firstLetter": user.username[0].toUpperCase()
    };
     localStorage.setItem("CurrentUser", JSON.stringify(currentUser));
  }

  let type = 'success';
  let icon = 'fa-solid fa-circle-check';
  let title = 'Success';
  let text = 'Update Information Successfully!';
  createToast(type, icon, title, text);

  
}


function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="content">
                <div class="title">${title}</div>
                <span>${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
        </div>`;
    notifications.append(newToast);
    newToast.timeOut = setTimeout(
        ()=>newToast.remove(), 5000
    )

}