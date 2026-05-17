import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const indianTime =
    currentTime.toLocaleTimeString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata"
      }
    );

  return (

    <div
      className={
        darkMode
          ? "container dark"
          : "container light"
      }
    >

      <div className="navbar">

        <div className="logo">
          📈 StockAI
        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >

          {darkMode
            ? "☀️ Light"
            : "🌙 Dark"}

        </button>

      </div>

      <div className="hero-section">

        <h1 className="hero-title">
          Track Stocks Smarter with AI 📈
        </h1>

        <h2 className="typewriter">
          Analyze Trends 📊 •
          Track Market Live 🚀 •
          Invest Smarter 💰
        </h2>

        <p className="hero-subtitle">
          Real-time market insights,
          AI recommendations,
          stock analytics &
          live updates.
        </p>

      </div>

      <div className="market-status-bar">

        <div>
          🇮🇳 Indian Time: {indianTime}
        </div>

        <div className="market-open">
          🟢 Market Open
        </div>

      </div>

      <footer className="footer">

        Built by{" "}

        <span>
          Vatam Prudvi Swar
        </span>

      </footer>

    </div>

  );

}

export default App;