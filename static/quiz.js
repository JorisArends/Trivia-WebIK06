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
    // console.log(json.results);
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
};

getNewQuestion = () =>  {

	// als er geen nieuwe vragen meer zijn
    if(availableQuestions.length == 0) {
        // GO TO GAME_OVER.HTML

		return window.location.assign("/game_over");
    }

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;
// 	console.log(question);

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
    	console.log(e.target);
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        // console.log(selectedChoice);

		// antwoord correct/incorrect
		//console.log(selectedAnswer == currentQuestion.answer);
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
// 		console.log(classToApply);

		// vraag correct, score omhoog
		if (classToApply === "correct") {
			incrementScore(punten_score);
		}

		else if (classToApply === "incorrect") {
			localStorage.setItem("mostRecentScore", score);
			$.get('/insert_score',{username: username, score: score, category: category});
			return window.location.assign("/game_over");
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
