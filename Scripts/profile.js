

$(document).ready(function() {
    const playerID = JSON.parse(localStorage.getItem("CurrentUser")).id; // current user id
    const  user = getPlayerById(playerID);
    if(user!=null) {
    $("#username").text(user.username);
    $("#email").text(user.email);
    $("#inputField").val(user.password);
    $("#level").text(user.level);
    }

    $(".back_btn").click(function(){
     window.history.back();
    });
});



/**
 * find player by ID in userDatabase
 * @param {*} id 
 * @returns 
 */
function getPlayerById(id) {
    
    const storedData = localStorage.getItem('userDatabase');

    // Check if there is any stored data
    if (storedData) {

        const users = JSON.parse(storedData);
        const user = users.find(user => user.userid === id);

        return user;
    } else {
        // If no data is stored, return null
        return null;
    }
}