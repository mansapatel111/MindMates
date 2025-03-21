const express = require("express");
const router = express.Router();

const questions = [
  "What is one thing you're grateful for today?",
  "What was a small win you had today?",
  "What is something positive you can tell yourself right now?",
  "Who is someone you appreciate, and why?",
  "What is one act of kindness you can do today?"
];

router.get("/:step", (req, res) => {
  const step = parseInt(req.params.step);
  if (step < questions.length) {
    res.json({ question: questions[step] });
  } else {
    res.json({ message: "Great job! Today's streak completed. See you tomorrow!" });
  }
});

module.exports = router;
