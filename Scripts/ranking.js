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

console.log(players);

const users = usersData.reduce((acc, user) => {
    acc[user.userid] = user.username;
    return acc;
}, {});

// Sort players by rank points
players.sort((a, b) => b.rankPoints - a.rankPoints);

// Print leaderboard
console.log("Leaderboard:");
players.forEach((player, index) => {
    console.log(`${index + 1}. ${users[player.id]} - Rank Points: ${player.rankPoints}`);
});

