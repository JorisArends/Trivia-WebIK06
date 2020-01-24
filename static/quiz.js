const question = document.getElementById("question");
const choices= Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;

let availableQuestions = [];

let questions= [];

// .addEventListener("click", function(event) {
// fetch(`/quiz?https://opentdb.com/api.php?amount={amount}&category={category}&difficulty={difficulty}&token={token}").json()`)
fetch(
"https://opentdb.com/api.php?amount=50&category="+category+"&type=multiple&token="+token+""
)
  .then(response => {
    return response.json();
  })

  .then(json => {
    console.log(json.results);
    questions = json.results.map(json => {
      const formattedQuestion = {
        question: json.question
      };

      const answerChoices = [...json.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        json.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    startGame();
  })
  .catch(err => {
    console.error(err);
  });


// aantal vragen correct is een punt
const punten_score = 1;

startGame = ()  => {
	score = 0;
	// pak array questions en zet het in de array available
	// full copy van questions
	availableQuestions = [ ... questions];
	// console.log(availableQuestions);
	getNewQuestion();
	countdown();
};

getNewQuestion = () =>  {

	// als er geen nieuwe vragen meer zijn
    if(availableQuestions.length == 0) {
        // GO TO GAME_OVER.HTML

		return window.location.assign("/game_over");
    }

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	currentQuestion.question = decodeHTML(currentQuestion.question);
	question.innerText = currentQuestion.question;
// 	console.log(question);

	choices.forEach( choice => {
	    const number = choice.dataset["number"];

	    choice.innerText = decodeHTML(currentQuestion["choice" + number]);
	});

	// get new question en niet een oude
	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.parentElement.addEventListener("click", e => {
    console.log(e.target);
    if(!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

		// antwoord correct/incorrect
		//console.log(selectedAnswer == currentQuestion.answer);
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
// 		console.log(classToApply);

		// vraag correct, score omhoog
		if (classToApply === "correct") {
			incrementScore(punten_score);
		}

		else if (classToApply === "incorrect") {
		  setTimeout(() => {
          if ($(e.target).hasClass('choice-container')) {
		        selectedChoice.classList.add(classToApply);
		      }
		      else {
		        selectedChoice.parentElement.classList.add(classToApply);
		      }
	      countdown();
	    }, 200);

			localStorage.setItem("mostRecentScore", score);
			$.get('/insert_score',{username: username, score: score, category: category, time: time});
			// console.log($.get('/insert_score',{username: username, score: score, category: category, time:time}));

			return window.location.assign("/game_over");
		}
		if ($(e.target).hasClass('choice-container')) {
		  selectedChoice.classList.add(classToApply);
		}
		else {
		  selectedChoice.parentElement.classList.add(classToApply);
		}


		// wacht voor 1 sec voordat het doorgaat met vraag maakt niet uit of correct/incorrect
	    setTimeout(() => {
          if ($(e.target).hasClass('choice-container')) {
		        selectedChoice.classList.remove(classToApply);
		      }
		      else {
		        selectedChoice.parentElement.classList.remove(classToApply);
		      }
	      getNewQuestion();
	      countdown();
	    }, 1000);

    });
});

// score omhoog functie
incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

//decode html enteties
var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};


// Countdown timer per question of 10 seconds
function countdown() {
  var timeleft = 10;
  var counter = 0;
  var countdown = document.getElementById("countdown");
    $("#countdown").text(timeleft - counter);

  function Time() {
    counter++;
    $("#countdown").text(timeleft - counter);
  }
  setInterval(Time, 1000);
}

// ALgemene timer die gespeelde tijd registreert
let count = 0;
let intervalRef = null;

intervalRef = setInterval(_ => {
  count+=10;

  let s = Math.floor((count /  1000)) % 60;
  let m = Math.floor((count / 60000)) % 60;
  if(m<10){
  	m = "0"+ m;
  }
  if(s<10){
  	s = "0" + s;
  }
	time = m + ":" + s
  $('#timer').text(time);
}, 10);

