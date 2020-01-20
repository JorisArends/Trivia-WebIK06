const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

finalScore.innerText = mostRecentScore;

saveHighScore = e => {

  // if no username is given than can not click button
  console.log("clicked the save button!");
  e.preventDefault();

  window.location.assign("/");
};