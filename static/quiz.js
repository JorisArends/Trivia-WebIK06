// console.log("Hello,world!");

const question = document.getElementById("question");
const choices= Array.from(document.getElementsByClassName("choice-text"));
// const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
// is dit nodig ?
// let questionCounter= 0;
let availableQuestions = [];

let questions= [];

fetch(
  "https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple"
)
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
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


// CONSTANTS
// aantal vragen correct is een punt
const punten_score = 1;

// max vragen hebben wij niet
// const MAX_QUESTIONS= 10;

startGame = ()  => {
	// beginquiz counter op 0
	// questionCounter = 0;
	score = 0;
	// pak array questions en zet het in de array available
	// full copy van questions
	availableQuestions = [ ... questions];
	// console.log(availableQuestions);
	getNewQuestion();
};

getNewQuestion = () =>  {

	// als er geen nieuwe vragen meer zijn
	// if ( ..... || questionCounter >= MAX_QUESTIONS)
    if(availableQuestions.length == 0 ){
    	localStorage.setItem("mostRecentScore", score);
    	// GO TO GAME_OVER.HTML
		return window.location.assign("/game_over");
    }

	// questionCounter++;
	// update vraag counter
	// prog...innerText = questionCounter + "/" + MAX_QUESTIONS;
	// progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

	 //Update the progress bar
	// progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;
	// console.log(question);

	choices.forEach( choice => {
	    const number = choice.dataset["number"];
	    choice.innerText = currentQuestion["choice" + number];
	});

	// get new question en niet een oude
	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
    	// console.log(e.target);
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];


		// antwoord correct/incorrect
		//console.log(selectedAnswer == currentQuestion.answer);
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
		// console.log(classToApply);

		// vraag correct, score omhoog
		if (classToApply === "correct") {
			incrementScore(punten_score);
		}

    	selectedChoice.parentElement.classList.add(classToApply);

		// wacht voor 1 sec voordat het doorgaat met vraag maakt niet uit of correct/incorrect
	    setTimeout(() => {
	      selectedChoice.parentElement.classList.remove(classToApply);
	      getNewQuestion();
	    }, 1000);

    });
});

// score omhoog functie
incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};




