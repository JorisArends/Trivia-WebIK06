// const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

// geen highscore return lege array
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
// console.log(highScores);
// const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

// username.addEventListener("keyup", () => {
//     // console.log(username.value);

//     // if no username is given than can not click button
//     saveScoreBtn.disabled = !username.value;
// });

saveHighScore = e => {
  console.log("clicked the save button!");
  e.preventDefault();
// };

  // const score = {
  //   // score = highScores
  //   score: Math.floor(Math.random() * 100),
  //   // name: username.value
  // };
  // highScores.push(score);

  // // sorteer highscores van hoog naar laag
  // highScores.sort((a, b) => b.score - a.score);
  // highScores.splice(5);


  // localStorage.setItem("highScores", JSON.stringify(highScores));

  // als score is saved go back naar index
  // window.location.assign("/");
  console.log(highScores);
};
