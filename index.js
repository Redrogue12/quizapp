const timerInMinutes = 5;
let countDownDate // placeholder for the moment the program starts
let correctAnswers = 0;
let countdown
let currentQuestion

// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
const requestURL = './questions.json';
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

let questions = [];
request.onload = function() {
  questions = request.response;
}

let current = 0;

const saveScore = () => {
  const initials = prompt('Your score is: ' + correctAnswers + '! Write your initials to save your score.');
  document.getElementById('score-placeholder').innerHTML = initials + ': ' + correctAnswers;
}

const finishProgram = () => {
  clearInterval(countdown);
  document.getElementById('timer').innerHTML = "EXPIRED";
  document.getElementById('questions-container').innerHTML = "You got " + correctAnswers + " questions correct!";
  saveScore();
}

const handleCounter = distance => {
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById('timer').innerHTML = minutes + "m " + seconds + "s ";
}

const renderCurrentQuestion = () => {
  const currentQuestion = questions[current];
  const { question, answers } = currentQuestion;
  document.getElementById('question').innerHTML = question;

  document.getElementById('optionLabel1').innerHTML = answers[0];
  document.getElementById('option1').value = 0;

  document.getElementById('optionLabel2').innerHTML = answers[1];
  document.getElementById('option2').value = 1;

  document.getElementById('optionLabel3').innerHTML = answers[2];
  document.getElementById('option3').value = 2;

  document.getElementById('optionLabel4').innerHTML = answers[3];
  document.getElementById('option4').value = 3;
}

// https://www.w3schools.com/howto/howto_js_countdown.asp
const countdownHelper = () => {
  document.getElementById('instructions').style.display = "none";
  document.getElementById("questions-container").style.display = "block";

  // Find the distance between now and the count down date
  const now = new Date().getTime();
  const distance = countDownDate - now;

  // this solely determines when the program ends
  if (distance < 0 || current > 4) {
    finishProgram();
    return;
  }

  handleCounter(distance);
  renderCurrentQuestion();
}

const resetInput = () => {
  document.getElementById('option1').checked = false;
  document.getElementById('option2').checked = false;
  document.getElementById('option3').checked = false;
  document.getElementById('option4').checked = false;
}

const substractFromTimer = () => {
  countDownDate.setMinutes( countDownDate.getMinutes() - 1 );
};

const startCountdown = () => {
  countDownDate = new Date(new Date().getTime() + timerInMinutes*60000);
  const form = document.querySelector("form");
  countdown = setInterval(countdownHelper, 1000);
  
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const { correct } = questions[current];
    let answer = "";
    for (const entry of data) {
      answer = parseInt(entry[1]);
    };
    console.log('answer:', answer)
    console.log('correct:', correct)


    if (answer === correct) correctAnswers++;
    else substractFromTimer();

    resetInput();

    current++;
  }, false);
}