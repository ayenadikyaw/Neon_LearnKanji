$(document).ready(function() {
// Retrieve data from local storage
const playersData = JSON.parse(localStorage.getItem('Players'));
const usersData = JSON.parse(localStorage.getItem('userDatabase'));


// Parse JSON data
const players = playersData.map(player => {
    return {
        id: Object.keys(player)[0],
        rankPoints: player[Object.keys(player)[0]].PlayerProgress[2].rankPoints
    };
});


const users = usersData.reduce((acc, user) => {
    acc[user.userid] = user.username;
    return acc;
}, {});

// Sort players by rank points
players.sort((a, b) => b.rankPoints - a.rankPoints);

// Print leaderboard
players.forEach((player, index) => {
    if(index < 3){
        $("#leaderboard").append(`
        <div class="user">
            <i class="iconCircle">
              <i class="fa-solid fa-ghost icon neon"></i>
            </i>
            <span>${users[player.id]}</span>
            <span>${player.rankPoints} <span>points</span></span>
            <span>Top</span><span>${index+1}</span>
          </div>
        
        `);
    }
    else{
        $("#leaderboard").append(`
        <div class="user">
        <i class="iconCircle">
          <i class="fa-solid fa-ghost icon neon"></i>
        </i>
        <span>${users[player.id]}</span>
        <span>${index+1}</span>
      </div>
        
        `);

    }
 

   // console.log(`${index + 1}. ${users[player.id]} - Rank Points: ${player.rankPoints}`);
});

});