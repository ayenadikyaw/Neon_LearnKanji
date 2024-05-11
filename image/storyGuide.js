

const room =
  "There are Four rooms which are Learning Room, Game Room, LeaderBoard Room and Data Room. The main rooms are Learning Room and Game Room.";
const grades =
  "Neon is provided from Grade - 1 to Grade 6. You can join any grade you want to study and learn kanji by level.";
const levels =
  "As for how many levels can be studied, the number of levels may vary depending on each grade, so there is no specific number of levels. All levels except the 1st level will be locked, so you need to pass each level.";
const learning =
  "You can learn all the kanji in the Learning room. It provided for each kanji which are the meaning, pronunciation, the writing method and the example sentence. It arranged 10 kanji for each level.";
const game =
  "The game room will help you how you can test how many of the kanji you have memorized. There are two types of game which are matching game and multiple choice game.";
const loginAndRegistration =
  "Registration Form is that need to know your email and your level of JLPT. When neon will have new features, it will inform you via Email. By registration, you can manipulate all features of neon website. If you already register, you can login easily.";
const resultsOfGame =
  "When you play the game, you need to answer 10 questions. If you can answer 7 or more questions, the next level will be unlocked automatically. If you can only answer questions 1 to 6, the next level will not unlock. As a reason you can answer the same level and study again.";
const fees =
  "Neon provide all features by fees free. You don't have to cost for anything.";

const array = [
  room,
  grades,
  levels,
  learning,
  game,
  loginAndRegistration,
  resultsOfGame,
  fees,
];
let index1 = 0;
let index2 = 1;

$(document).ready(function () {
  $("#box1").text(array[index1]);
  $("#box2").text(array[index2]);

  $("#next").click(function () {
    if(index2 <= array.length-2){
    doAnimation1(() => {
        // Animation 1 is complete, start Animation 2
        index1 += 2;
        index2 += 2;
        $("#box1").text(array[index1]);
        $("#box2").text(array[index2]);
        doAnimation2();
      });
    }else{
        window.location.href= "https://www.google.com";
    }
  });
});


async function doAnimation1(callback) {
   await $('.storyGuide0').stop().animate({
        left: '-=350px',
    }, 2000);

   await $('.guideLetter0').stop().animate({
        left: '+=1300px',
    }, 2000);

    await $('.storyGuide1').stop().animate({
        right: '-=350px',
    }, 2000);

    await $('.guideLetter1').stop().animate({
        right: '+=1300px',
    }, 2000,callback);


   

}


async function doAnimation2() {
   await $('.storyGuide0').stop().animate({
        left: '+=350px',
    }, 4000);

    await $('.guideLetter0').stop().animate({
        left: '-=1300px',
    }, 4000);

    await $('.storyGuide1').stop().animate({
        right: '+=350px',
    }, 4000);

    await $('.guideLetter1').stop().animate({
        right: '-=1300px',
    }, 4000);

}