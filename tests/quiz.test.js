// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("../src/quiz.js");

test("createQuiz starts with the supplied questions and zero progress", () => {
  const questions = [{ answer: 0 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state.questions, questions);
});

test("answerQuestion increments the score and returns true when the answer is correct", () => {
  const original = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(original, 1);

  assert.deepEqual(result, {
    state: { questions: original.questions, current: 0, score: 1 },
    correct: true,
  });
  assert.equal(original.score, 0);
});

test("answerQuestion preserves the score when the answer is incorrect", () => {
  const original = { questions: [{ answer: 1 }], current: 0, score: 2 };
  const result = answerQuestion(original, 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 2);
  assert.equal(original.score, 2);
  assert.notEqual(result.state, original);
});

test("advanceQuestion moves to the next question without changing the original state", () => {
  const original = createQuiz([{ answer: 0 }, { answer: 1 }]);
  const next = advanceQuestion(original);

  assert.equal(next.current, 1);
  assert.equal(original.current, 0);
});

test("isQuizFinished returns false before the final question has advanced", () => {
  assert.equal(isQuizFinished(createQuiz([{ answer: 0 }])), false);
});

test("isQuizFinished returns true after the final question has advanced", () => {
  const finished = advanceQuestion(createQuiz([{ answer: 0 }]));
  assert.equal(isQuizFinished(finished), true);
});

test("isQuizFinished returns true for a quiz with no questions", () => {
  assert.equal(isQuizFinished(createQuiz([])), true);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("isNewBestScore returns true when there is no previous best", () => {
  assert.equal(isNewBestScore(0, null), true);
});

test("isNewBestScore returns true when the current score is higher", () => {
  assert.equal(isNewBestScore(81, 80), true);
});

test("isNewBestScore returns false when the current score ties the best", () => {
  assert.equal(isNewBestScore(80, 80), false);
});

test("isNewBestScore returns false when the current score is lower", () => {
  assert.equal(isNewBestScore(79, 80), false);
});

test("formatTimeLeft formats positive seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats the low-time threshold", () => {
  assert.equal(formatTimeLeft(5), "⏱ 5s");
});

test("formatTimeLeft formats zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns an excellent message for an A", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
});

test("getFeedbackMessage returns an encouraging message for a B", () => {
  assert.equal(getFeedbackMessage("B"), "Great job!");
});

test("getFeedbackMessage returns an encouraging message for a C", () => {
  assert.equal(getFeedbackMessage("C"), "Good effort!");
});

test("getFeedbackMessage encourages practice for an unrecognized grade", () => {
  assert.equal(getFeedbackMessage("F"), "Keep practicing—you'll get there!");
});

test("getFeedbackMessage encourages practice for a null grade", () => {
  assert.equal(getFeedbackMessage(null), "Keep practicing—you'll get there!");
});
