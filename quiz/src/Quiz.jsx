import { useState, useEffect } from "react";
import "./styles.css";

const quizData = [
    {
        question: "Who is the founder of Newton School of Technology?",
        options: ["Ankit Sir", "Siddharth Sir", "Deepak Sir", "Krushn Sir"],
        answer: "Siddharth Sir",
      },
      {
        question: "Who teaches us WEB DEVELOPMENT(WEB DEVELOPMENT GOD)?",
        options: ["Deepak Sir", "Krushn Sir", "Ishika Ma'am", "Rishabh Sir"],
        answer: "Krushn Sir",
      },
      {
        question: "Who teaches us MATHEMATICS?",
        options: ["Deepak Sir", "Rishabh Sir", "Ishika Ma'am", "Siddharth Sir"],
        answer: "Rishabh Sir",
      },
      {
        question: "Who is known as the DSA God?",
        options: ["Krushn Sir", "Siddharth Sir", "Deepak Sir", "Ishika Ma'am"],
        answer: "Deepak Sir",
      },
      {
        question: "Who is the Batch A PI?",
        options: ["Krushn Sir", "Siddharth Sir", "Rishabh Sir", "Ishika Ma'am"],
        answer: "Ishika Ma'am",
      },
      {
        question: "Which semester is currently ongoing?",
        options: ["1st", "2nd", "3rd", "4th"],
        answer: "2nd",
      },
      {
        question: "How many campuses does Newton School of Technology have?",
        options: ["1", "2", "3", "4"],
        answer: "2",
      },
      {
        question: "Who among the following is NOT a faculty member?",
        options: ["Deepak Sir", "Siddharth Sir", "Rishabh Sir", "Ishika Ma'am"],
        answer: "Siddharth Sir",
      },
      {
        question: "Which of the following teachers is associated with Data Structures & Algorithms (DSA)?",
        options: ["Deepak Sir", "Krushn Sir", "Rishabh Sir", "Ishika Ma'am"],
        answer: "Deepak Sir",
      },
      {
        question: "Who among the following is a faculty member for Batch A?",
        options: ["Siddharth Sir", "Deepak Sir", "Ishika Ma'am", "Krushn Sir"],
        answer: "Ishika Ma'am",
      }
    
];

function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(() => {
    return Number(localStorage.getItem("quizScore")) || 0;
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [disableOptions, setDisableOptions] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(10); 

  useEffect(() => {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    localStorage.setItem("quizScore", score);
  }, [score]);

  useEffect(() => {
    if (quizFinished || !shuffledQuestions.length) return;

    setTimer(10);
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          handleNextQuestion();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentQuestion, shuffledQuestions]);

  const handleAnswerClick = (selectedOption) => {
    if (disableOptions) return;

    setDisableOptions(true);
    if (selectedOption === shuffledQuestions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Wrong answer!");
    }
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setDisableOptions(false);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setProgress(((nextQuestion + 1) / shuffledQuestions.length) * 100);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setShuffledQuestions([...quizData].sort(() => Math.random() - 0.5));
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setProgress(0);
    setFeedback("");
    setDisableOptions(false);
    setTimer(10);
    localStorage.removeItem("quizScore");
  };

  return (
    <div className="quiz-container">
      {quizFinished ? (
        <div className="quiz-end">
          <h2>Quiz Completed! 🎉</h2>
          <p>Your Score: {score} / {shuffledQuestions.length}</p>
          <button onClick={handleRestart} className="restart-btn">
            🔄 Restart Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-box">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <h3 className="timer">⏳ Time Left: {timer}s</h3>
          {shuffledQuestions[currentQuestion] ? (
            <>
              <h2>{shuffledQuestions[currentQuestion].question}</h2>
              {shuffledQuestions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  className="option-btn"
                  onClick={() => handleAnswerClick(option)}
                  disabled={disableOptions}
                >
                  {option}
                </button>
              ))}
              <p className="feedback">{feedback}</p>
              {feedback && (
                <button onClick={handleNextQuestion} className="next-btn">
                  Next ➡️
                </button>
              )}
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
