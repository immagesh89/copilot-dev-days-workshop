// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Creates a fresh quiz state without changing the supplied questions.
 */
function createQuiz(questions) {
  return { questions: [...questions], current: 0, score: 0 };
}

/**
 * Records an answer and returns the updated state and whether it was correct.
 */
function answerQuestion(state, selectedIndex) {
  const question = state.questions[state.current];
  const correct = isCorrect(question, selectedIndex);
  return {
    state: { ...state, score: state.score + (correct ? 1 : 0) },
    correct,
  };
}

/**
 * Advances the quiz to the next question without changing the original state.
 */
function advanceQuestion(state) {
  return { ...state, current: state.current + 1 };
}

/**
 * Returns whether the current question index is past the end of the quiz.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Returns whether the current percentage beats the previous best score.
 */
function isNewBestScore(current, best) {
  return best === null || current > best;
}

/**
 * Formats the remaining countdown time for display.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${seconds}s`;
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns an encouraging message for a grade.
 */
function getFeedbackMessage(grade) {
  if (grade === "A") return "Excellent work!";
  if (grade === "B") return "Great job!";
  if (grade === "C") return "Good effort!";
  return "Keep practicing—you'll get there!";
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createQuiz,
    answerQuestion,
    advanceQuestion,
    isQuizFinished,
    shuffle,
    isCorrect,
    calculatePercentage,
    isNewBestScore,
    formatTimeLeft,
    getGrade,
    getFeedbackMessage,
  };
}
