import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import "./App.css";
import { Background } from "./components/Background";

function App() {
  const [correct, setCorrect] = useState(() => {
    const saved = localStorage.getItem("correct");
    return saved ? parseInt(saved) : 0;
  });

  const [total, setTotal] = useState(() => {
    const saved = localStorage.getItem("total");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("correct", correct.toString());
    localStorage.setItem("total", total.toString());
  }, [correct, total]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    }
    setTotal((prev) => prev + 1);
  };

  const handleClear = () => {
    setCorrect(0);
    setTotal(0);
  };

  const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : "0.0";

  return (
    <>
      <Background />
      <div className="container">
        <h1>Practice Question Tracker</h1>
        <div className="stats">
          <div className="stat-item">
            <label>Score</label>
            <p className="stat-value">
              {correct} / {total}
            </p>
          </div>
          <div className="stat-item">
            <label>Grade</label>
            <p className="stat-value">{percentage}%</p>
          </div>
        </div>
        <div className="buttons">
          <button
            className="correct icon-button"
            onClick={() => handleAnswer(true)}
            aria-label="Mark as correct"
          >
            <FaCheck />
            <span>Correct</span>
          </button>
          <button
            className="incorrect icon-button"
            onClick={() => handleAnswer(false)}
            aria-label="Mark as incorrect"
          >
            <FaTimes />
            <span>Incorrect</span>
          </button>
          <button
            className="clear icon-button"
            onClick={handleClear}
            aria-label="Clear progress"
          >
            <FaTrash />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
