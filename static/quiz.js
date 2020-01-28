const question = document.getElementById("question");
const choices= Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;

let availableQuestions = [];
let questions= [];

// get questions from API
fetch("https://opentdb.com/api.php?amount=50&category="+category+"&type=multiple")
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
        formattedQuestion.difficulty = 1;
    }
    else if (json.difficulty == "medium"){
        formattedQuestion.difficulty = 2;
    }
    else if (json.difficulty == "hard"){
        formattedQuestion.difficulty = 3;
    }

	// multiple choice answers randomized
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


// variable for score
const punten_score = 1;

startGame = ()  => {
	score = 0;
	// full copy of array questions
	availableQuestions = [ ... questions];
	getNewQuestion();
};

var questionIndex = 0;
getNewQuestion = () =>  {
    questionIndex ++;

	// no new questions return to /game_over
    if(availableQuestions.length == 0) {
        // put score & time in db and go to /game_over
		localStorage.setItem("mostRecentScore", score);
		$.get('/insert_score',{username: username, score: score, category: category, time: time});
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
};

choices.forEach(choice => {
	choice.parentElement.addEventListener("click", e => {
	    if(!acceptingAnswers) return;

	    acceptingAnswers = false;

	    const selectedChoice = e.target;
	    const selectedAnswer = selectedChoice.dataset["number"];

		// see if selected answer == API answer
		// classToApply, see CSS
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

		// increment score
		if (classToApply === "correct") {
			incrementScore(punten_score);

			// if clicked (e.target) apply classToApply
			if ($(e.target).hasClass('choice-container') ) {
				selectedChoice.classList.add(classToApply);
			}
			else if ($(e.target).hasClass('choice-prefix')) {
				selectedChoice.parentElement.classList.add(classToApply);
			}
			else {
			  selectedChoice.parentElement.classList.add(classToApply);
			}
		}

		else if (classToApply === "incorrect") {
			// if clicked (e.target) apply classToApply
			if ($(e.target).hasClass('choice-container') ) {
	  			selectedChoice.classList.add(classToApply);
			}
			else if ($(e.target).hasClass('choice-prefix')) {
				selectedChoice.parentElement.classList.add(classToApply);
			}
		  	else {
		    	selectedChoice.parentElement.classList.add(classToApply);
		  	}

			// put score & time in db and go to /game_over
			localStorage.setItem("mostRecentScore", score);
			$.get('/insert_score',{username: username, score: score, category: category, time: time});
			return window.location.assign("/game_over");
		}


		// wait 1 sec before going to next question
	    setTimeout(() => {
	      // remove classToApply
	      if ($(e.target).hasClass('choice-container')) {
	      	selectedChoice.classList.remove(classToApply);
		   }
	      else if ($(e.target).hasClass('choice-prefix')) {
			selectedChoice.parentElement.classList.remove(classToApply);
			}
	      else {
	        selectedChoice.parentElement.classList.remove(classToApply);
	      }
    	getNewQuestion();
    	timeleft += 10;
    	}, 1000);
	});
});

// Add score points
incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

// Decode HTML enities
var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

// Timer for countdown and total time
let count = 0;
let intervalRef = null;
let timeleft = 10;

	intervalRef = setInterval(_ => {
	  count+=1000;

	  let s = Math.floor((count /  1000)) % 60;
	  let m = Math.floor((count / 60000)) % 60;
	  if(m<10){
	  	m = "0"+ m;
	  }
	  if(s<10){
	  	s = "0" + s;
	  }
		time = m + ":" + s;
	  $('#timer').text(time);

		countdown = timeleft - s;
		if (countdown <= 0){
			localStorage.setItem("mostRecentScore", score);
			$.get('/insert_score',{username: username, score: score, category: category, time: time});
			return window.location.assign("/game_over");
		}
		$("#countdown").text(countdown);
	}, 1000);

// Source code for property-sort helperfunction: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}
