# Repository instructions

## Build, test, and run

- Run the test suite from the repository root with `npm test` (Node.js 20+; no install step is needed).
- Run one test file with `node --test tests/quiz.test.js` or `node --test tests/questions.test.js`.
- Run one named test with `node --test --test-name-pattern="getGrade gives an A" tests/quiz.test.js` (replace the pattern with the test name to target).
- Start the browser app with `npm start`; it serves `src/` at `http://localhost:8080`.
- There is no build or lint script in `package.json`.

The starter suite intentionally has one failing test: `getGrade gives an A for exactly 90%`. The README and workshop guides use this as the Chapter 4 debugging exercise. Preserve that expected failure unless the requested work is to complete the exercise or otherwise fix the grading bug.

## Architecture

This is a small, dependency-free browser quiz written in plain HTML, CSS, and JavaScript:

- `src/index.html` defines the three quiz screens and loads `questions.js`, `quiz.js`, then `app.js`. Keep this order: the browser code uses globals established by the earlier scripts.
- `src/questions.js` owns the `QUESTIONS` data. `src/quiz.js` contains DOM-independent shuffle, answer-checking, percentage, and grade logic; it conditionally exports these functions with CommonJS so Node's test runner can test them.
- `src/app.js` owns DOM interaction and quiz state, calling the data and logic above. Keep UI changes here and reusable quiz rules in `quiz.js`.
- `src/style.css` styles the app and its interactive states.
- The repository-root `index.html` redirects GitHub Pages visitors to `src/index.html`.
- `tests/quiz.test.js` tests quiz logic; `tests/questions.test.js` validates question data. The workshop guides in `workshops/` describe the intended learning flow and may request changes not yet present in the starter.

## Conventions

- Questions have `question` text, exactly four `options`, and an `answer` integer containing the zero-based index of the correct option. The data tests also require at least five questions and unique question text.
- Keep core quiz functions independent of the DOM so they remain testable in Node. Browser scripts use globals; only add the existing conditional `module.exports` bridge where Node tests need it.
- Tests use Node's built-in `node:test` and `node:assert/strict`; no test framework or dependency installation is required.
