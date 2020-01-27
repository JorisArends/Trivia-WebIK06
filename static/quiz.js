const question = document.getElementById("question");
const choices= Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;

let availableQuestions = [];

let questions= [];

// Source code for property sort helperfunction: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

fetch("https://opentdb.com/api.php?amount=50&category="+category+"&type=multiple&token="+token+"")
  .then(response => {
    return response.json();
    })

  .then(json => {
    questions = json.results.map(json => {
      const formattedQuestion = {
        question: json.question
    };

    // Add difficulty and change values to numbers for comparing
    if (json.difficulty == "easy"){
        formattedQuestion.difficulty = 1
    }
    else if (json.difficulty == "medium"){
        formattedQuestion.difficulty = 2
    }
    else if (json.difficulty == "hard"){
        formattedQuestion.difficulty = 3
    }

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
    questions.sort(dynamicSort("difficulty"));
    startGame();
  })

// Errors for debug
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
	getNewQuestion();
};
var questionIndex = 0;
getNewQuestion = () =>  {
    questionIndex ++;

	// als er geen nieuwe vragen meer zijn
    if(availableQuestions.length == 0) {
        // GO TO GAME_OVER.HTML
		return window.location.assign("/game_over");
    }

	currentQuestion = availableQuestions[questionIndex];
	currentQuestion.question = decodeHTML(currentQuestion.question);
	question.innerText = currentQuestion.question;

	choices.forEach( choice => {
	    const number = choice.dataset["number"];

	    choice.innerText = decodeHTML(currentQuestion["choice" + number]);
	});

	// get new question, make sure it is not an old question
	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;
	console.log(currentQuestion)
};

choices.forEach(choice => {
  choice.parentElement.addEventListener("click", e => {
    console.log(e.target);
    if(!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

		// antwoord correct/incorrect
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

		// vraag correct, score omhoog
		if (classToApply === "correct") {
			incrementScore(punten_score);
		}

		else if (classToApply === "incorrect") {
				if ($(e.target).hasClass('choice-container')) {
		  		selectedChoice.classList.add(classToApply);
				}
		  	else {
		    	selectedChoice.parentElement.classList.add(classToApply);
		  	}

		localStorage.setItem("mostRecentScore", score);
		$.get('/insert_score',{username: username, score: score, category: category, time: time});
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

