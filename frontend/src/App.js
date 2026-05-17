import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [darkMode, setDarkMode] =
    useState(true);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [trendingStocks, setTrendingStocks] =
    useState([]);

  const [query, setQuery] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  // Live Time

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // Trending Stocks

  useEffect(() => {

    const fetchTrending = async () => {

      try {

        const response = await fetch(
          "https://stockai-backend-xzm4.onrender.com/trending"
        );

        const data = await response.json();

        if (Array.isArray(data)) {

          setTrendingStocks(data);

        }

      } catch (error) {

        console.log(error);

      }

    };

    fetchTrending();

  }, []);

  // Search Companies

  const searchCompanies = async (
    value
  ) => {

    setQuery(value);

    if (value.length > 1) {

      try {

        const response = await fetch(
          `https://stockai-backend-xzm4.onrender.com/search/${value}`
        );

        const data =
          await response.json();

        setSuggestions(data);

      } catch (error) {

        console.log(error);

      }

    } else {

      setSuggestions([]);

    }

  };

  // Indian Time

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

      {/* Navbar */}

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

      {/* Hero Section */}

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

      {/* Market Status */}

      <div className="market-status-bar">

        <div>
          🇮🇳 Indian Time: {indianTime}
        </div>

        <div className="market-open">
          🟢 Market Open
        </div>

      </div>

      {/* Search Section */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Search NSE/BSE Stocks"

          value={query}

          onChange={(e) =>
            searchCompanies(
              e.target.value
            )
          }
        />

        {/* Suggestions */}

        {suggestions.length > 0 && (

          <div className="suggestions">

            {suggestions.map(
              (item, index) => (

                <div
                  key={index}
                  className="suggestion-item"
                >

                  {item.name}

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* Trending Stocks */}

      <div className="trending-section">

        <h2 className="section-title">
          🔥 Trending Stocks
        </h2>

        <div className="trending-container">

          {Array.isArray(trendingStocks) &&
          trendingStocks.map(
            (stock, index) => (

              <div
                key={index}
                className="trending-card"
              >

                <h3>
                  {stock.name}
                </h3>

                <p
                  className={
                    stock.change >= 0
                      ? "positive"
                      : "negative"
                  }
                >

                  {stock.change >= 0
                    ? "+"
                    : ""}

                  {stock.change}%

                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* Contact Section */}

      <div className="contact-section">

        <h2>
          📬 Connect With Me
        </h2>

        <div className="contact-links">

          <a
            href="https://www.linkedin.com/in/vatam-prudvi-swar-reddy-b52653297/"
            target="_blank"
            rel="noreferrer"
            className="icon-btn linkedin-contact"
          >

            💼

          </a>

          <a
            href="https://www.instagram.com/its_prudvi/"
            target="_blank"
            rel="noreferrer"
            className="icon-btn insta-contact"
          >

            📸

          </a>

          <a
            href="mailto:vatamprudvi@gmail.com"
            className="icon-btn email-contact"
          >

            ✉️

          </a>

        </div>

      </div>

      {/* Feedback */}

      <div className="feedback-section">

        <h2>
          💬 Feedback
        </h2>

        <p>
          Found a bug?
          Have suggestions?
          Help improve StockAI.
        </p>

        <a
          href="https://forms.gle/iD3oJeHBvXZdsbng6"
          target="_blank"
          rel="noreferrer"
          className="feedback-btn"
        >

          Give Feedback 🚀

        </a>

      </div>

      {/* Footer */}

      <footer className="footer">

        Built by{" "}

        <span>
          Vatam Prudvi Swar
        </span>

        • Powered by Yahoo Finance

      </footer>

    </div>

  );

}

export default App;