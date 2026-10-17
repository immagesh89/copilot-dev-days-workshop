// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_SECONDS = 15;
const BEST_SCORE_STORAGE_KEY = "dev-days-quiz-best-score";
let state = createQuiz([]);
let timeLeft = QUESTION_TIME_SECONDS;
let countdownInterval = null;
let questionCompleted = false;
let bestScore = null;
let bestScoreAvailable = true;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const startBestScoreText = document.getElementById("start-best-score");
const resultBestScoreText = document.getElementById("result-best-score");
const newBestMessage = document.getElementById("new-best-message");
const storageStatus = document.getElementById("storage-status");

function updateBestScoreDisplays() {
  const scoreLabel = bestScoreAvailable
    ? bestScore === null
      ? "Best score: None yet"
      : `Best score: ${bestScore}%`
    : "Best score: Unavailable";
  startBestScoreText.textContent = scoreLabel;
  resultBestScoreText.textContent = scoreLabel;
}

function loadBestScore() {
  try {
    const storedScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (storedScore === null) return null;

    const score = Number(storedScore);
    if (Number.isInteger(score) && score >= 0 && score <= 100) return score;

    bestScoreAvailable = false;
    storageStatus.textContent = "The saved best score is invalid and was not changed.";
    storageStatus.hidden = false;
    return null;
  } catch {
    bestScoreAvailable = false;
    storageStatus.textContent = "Best score storage is unavailable; your score may not be saved.";
    storageStatus.hidden = false;
    return null;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
    return true;
  } catch {
    storageStatus.textContent = "Could not save your new best score; it will not persist after you leave.";
    storageStatus.hidden = false;
    return false;
  }
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function stopCountdown() {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("timer--urgent", timeLeft <= 5);
}

function startQuiz() {
  stopCountdown();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopCountdown();
  questionCompleted = false;
  timeLeft = QUESTION_TIME_SECONDS;
  updateTimerDisplay();

  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  countdownInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) {
      stopCountdown();
      timeOutQuestion();
    }
  }, 1000);
}

function selectAnswer(selectedIndex, selectedButton) {
  if (questionCompleted) return;
  questionCompleted = true;
  stopCountdown();

  const question = state.questions[state.current];
  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function timeOutQuestion() {
  if (questionCompleted) return;
  questionCompleted = true;

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopCountdown();
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopCountdown();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  const newBest = bestScoreAvailable && isNewBestScore(percentage, bestScore);
  newBestMessage.hidden = !newBest;
  if (newBest) {
    bestScore = percentage;
    saveBestScore(percentage);
  }
  updateBestScoreDisplays();
  showScreen(resultScreen);
}

bestScore = loadBestScore();
updateBestScoreDisplays();

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
