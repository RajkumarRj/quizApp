import { useState, useEffect } from "react";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [choiceClicked, setChoiceClicked] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setQuestions(data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setChoiceClicked(true);
  };

  const handleNextQuestion = () => {
    if (choiceClicked && selectedAnswer === questions[currentQuestion]?.correct_answer) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }
    setSelectedAnswer(null);
    setChoiceClicked(false);
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handleSkipQuestion = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setSelectedAnswer(null);
    setChoiceClicked(false);
  };

  return (
    <>
      {questions.length > 0 && currentQuestion < questions.length && (
        <div className="flex">
          <h3>{currentQuestion + 1}.{questions[currentQuestion]?.question}</h3>
          <ul>
            {[
              ...questions[currentQuestion]?.incorrect_answers,
              questions[currentQuestion]?.correct_answer,
            ].map((answer, index) => (
              <button
                className="click-button"
                key={index}
                onClick={() => handleAnswerClick(answer)}
                style={{
                  backgroundColor:
                    selectedAnswer === answer
                      ? "lightblue"
                      : selectedAnswer === null
                      ? "white"
                      : "lightcoral",
                }}
              >
                {answer}
              </button>
            ))}
          </ul>
          <div className="button-container">

            <button className="next" onClick={handleSkipQuestion}>
              Skip
            </button>

            {choiceClicked && (
              <button className="next" onClick={handleNextQuestion}>
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              </button>
            )}
            
          </div>
        </div>
      )}

      {currentQuestion === questions.length && (
        <div className="flex">
          <h2>Quiz Completed!</h2>
          <p>
            You answered {correctAnswers} out of {questions.length} questions
            correctly.
          </p>
        </div>
      )}
    </>
  );
}
