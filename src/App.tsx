import { useState, useEffect } from "react";
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
            <label>Success Rate</label>
            <p className="stat-value">{percentage}%</p>
          </div>
        </div>
        <div className="buttons">
          <button className="correct" onClick={() => handleAnswer(true)}>
            ✓ Correct
          </button>
          <button className="incorrect" onClick={() => handleAnswer(false)}>
            ✗ Incorrect
          </button>
        </div>
        <button className="clear" onClick={handleClear}>
          Clear Progress
        </button>
      </div>
    </>
  );
}

export default App;
