import React, {
  useState,
  useEffect
} from "react";

import "./App.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {

  const [query, setQuery] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [stockData, setStockData] =
    useState(null);

  const [investment, setInvestment] =
    useState("");

  const [showChart, setShowChart] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [trendingStocks, setTrendingStocks] =
    useState([]);

  const [marketMovers, setMarketMovers] =
    useState({
      gainers: [],
      losers: []
    });

  // =========================
  // LIVE TIME
  // =========================

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // =========================
  // TRENDING STOCKS
  // =========================

  useEffect(() => {

    const fetchTrending = async () => {

      try {

        const response =
          await fetch(
            "https://stockai-backend-xzm4.onrender.com/trending"
          );

        const data =
          await response.json();

        setTrendingStocks(
          Array.isArray(data)
            ? data
            : []
        );

      } catch {

        setTrendingStocks([]);

      }

    };

    fetchTrending();

  }, []);

  // =========================
  // MARKET MOVERS
  // =========================

  useEffect(() => {

    const fetchMovers = async () => {

      try {

        const response =
          await fetch(
            "https://stockai-backend-xzm4.onrender.com/market-movers"
          );

        const data =
          await response.json();

        setMarketMovers({

          gainers:
            data.gainers || [],

          losers:
            data.losers || []

        });

      } catch {

        setMarketMovers({

          gainers: [],
          losers: []

        });

      }

    };

    fetchMovers();

  }, []);

  // =========================
  // SEARCH STOCKS
  // =========================

  const searchCompanies = async (
    value
  ) => {

    setQuery(value);

    if (value.length > 1) {

      try {

        const response =
          await fetch(
            `https://stockai-backend-xzm4.onrender.com/search/${value}`
          );

        const data =
          await response.json();

        setSuggestions(data);

      } catch {

        setSuggestions([]);

      }

    } else {

      setSuggestions([]);

    }

  };

  // =========================
  // FETCH STOCK
  // =========================

  const fetchStock = async (

    ticker,
    companyName

  ) => {

    setLoading(true);

    try {

      const response =
        await fetch(
          `https://stockai-backend-xzm4.onrender.com/stock/${ticker}`
        );

      const data =
        await response.json();

      setStockData(data);

      setQuery(companyName);

      setSuggestions([]);

    } catch {

      alert(
        "Unable to fetch stock"
      );

    }

    setLoading(false);

  };

  // =========================
  // LIVE GRAPH REFRESH
  // =========================

  useEffect(() => {

    if (!stockData) return;

    const interval = setInterval(
      async () => {

        try {

          const response =
            await fetch(
              `https://stockai-backend-xzm4.onrender.com/stock/${stockData.symbol}`
            );

          const updated =
            await response.json();

          setStockData(updated);

        } catch {}

      },
      20000
    );

    return () =>
      clearInterval(interval);

  }, [stockData]);

  // =========================
  // INVESTMENT
  // =========================

  const calculateShares = () => {

    if (
      !investment ||
      !stockData
    )
      return 0;

    return Math.floor(
      investment /
      stockData.current_price
    );

  };

  const estimatedReturn = () => {

    if (
      !investment ||
      !stockData
    )
      return 0;

    return Math.floor(
      investment *
      (
        stockData.return_percent /
        100
      )
    );

  };

  // =========================
  // MARKET STATUS
  // =========================

  const indianTime =
    currentTime.toLocaleTimeString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata"
      }
    );

  const nowIndia = new Date(
    currentTime.toLocaleString(
      "en-US",
      {
        timeZone:
          "Asia/Kolkata"
      }
    )
  );

  const currentHour =
    nowIndia.getHours();

  const currentMinute =
    nowIndia.getMinutes();

  const currentDay =
    nowIndia.getDay();

  const isWeekend =
    currentDay === 0 ||
    currentDay === 6;

  const marketOpen =
    !isWeekend &&
    (
      (
        currentHour > 9 ||
        (
          currentHour === 9 &&
          currentMinute >= 15
        )
      ) &&
      (
        currentHour < 15 ||
        (
          currentHour === 15 &&
          currentMinute <= 30
        )
      )
    );

  return (

    <div
      className={
        darkMode
          ? "container dark"
          : "container light"
      }
    >

      {/* NAVBAR */}

      <div className="navbar">

        <div className="logo">

          📈 StockAI

        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
        >

          {darkMode
            ? "☀️ Light"
            : "🌙 Dark"}

        </button>

      </div>

      {/* HERO */}

      <div className="hero-section">

        <h1 className="hero-title">

          Track Stocks Smarter
          with AI 📈

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

      {/* MARKET STATUS */}

      <div className="market-status-bar">

        <div>

          🇮🇳 Indian Time:
          {" "}
          {indianTime}

        </div>

        <div
          className={
            marketOpen
              ? "market-open"
              : "market-closed"
          }
        >

          {marketOpen
            ? "🟢 Market Open"
            : "🔴 Market Closed"}

        </div>

      </div>

      {/* MARKET INFO */}

      <div className="market-info-grid">

        <div className="info-card">

          <h3>

            🕘 Opening Time

          </h3>

          <p>

            9:15 AM IST

          </p>

        </div>

        <div className="info-card">

          <h3>

            🕞 Closing Time

          </h3>

          <p>

            3:30 PM IST

          </p>

        </div>

        <div className="info-card">

          <h3>

            📅 Trading Days

          </h3>

          <p>

            Monday - Friday

          </p>

        </div>

        <div className="info-card">

          <h3>

            🚫 Closed On

          </h3>

          <p>

            Weekends &
            NSE Holidays

          </p>

        </div>

      </div>

      {/* SEARCH */}

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

        {suggestions.length > 0 && (

          <div className="suggestions">

            {suggestions.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}

                  className="suggestion-item"

                  onClick={() =>
                    fetchStock(
                      item.symbol,
                      item.name
                    )
                  }
                >

                  {item.name}

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* LOADER */}

      {loading && (

        <div className="loader-container">

          <p>

            Fetching Stock Data...

          </p>

        </div>

      )}

      {/* STOCK DETAILS */}

      {stockData && (

        <div className="stock-card">

          <h2>

            {stockData.company}

          </h2>

          <p>

            💰 Current Price:
            ₹
            {
              stockData.current_price
            }

          </p>

          <p>

            🏢 Sector:
            {
              stockData.sector
            }

          </p>

          <p>

            📈 Predicted Return:
            {
              stockData.return_percent
            }%

          </p>

          {/* INVESTMENT */}

          <div className="investment-box">

            <input
              type="number"

              placeholder="Enter Amount"

              value={investment}

              onChange={(e) =>
                setInvestment(
                  e.target.value
                )
              }
            />

            {investment && (

              <div className="analysis">

                <p>

                  Shares:
                  {
                    calculateShares()
                  }

                </p>

                <p>

                  Estimated Profit:
                  ₹
                  {
                    estimatedReturn()
                  }

                </p>

              </div>

            )}

          </div>

          {/* GRAPH BUTTON */}

          <button
            className="graph-btn"

            onClick={() =>
              setShowChart(
                !showChart
              )
            }
          >

            {showChart
              ? "Hide Graph 📉"
              : "Show Graph 📈"}

          </button>

          {/* BUY BUTTON */}

          <button
            className="buy-btn"

            onClick={() => {

              window.open(
                `https://groww.in/stocks/${stockData.symbol}`,
                "_blank"
              );

            }}
          >

            Buy on Groww 🚀

          </button>

        </div>

      )}

      {/* GRAPH */}

      {stockData &&
      showChart &&
      stockData.history &&
      stockData.history.length > 0 && (

        <div className="live-market-chart">

          <h2>

            📊 1 Week Analysis

          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart
              data={stockData.history}
            >

              <XAxis
                dataKey="date"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"

                dataKey="price"

                stroke="#22c55e"

                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      )}

      {/* NEWS */}

      {stockData &&
      Array.isArray(
        stockData.news
      ) && (

        <div className="news-section">

          <h2>

            Latest News 📰

          </h2>

          {stockData.news.map(
            (
              news,
              index
            ) => (

              <div
                key={index}

                className="news-box"
              >

                <p>

                  {news.title}

                </p>

                <a
                  href={news.link}

                  target="_blank"

                  rel="noreferrer"

                  className="read-more"
                >

                  Read More →

                </a>

              </div>

            )
          )}

        </div>

      )}

      {/* MARKET MOVERS */}

      <div className="market-section">

        {/* GAINERS */}

        <div className="market-box">

          <h2>

            📈 Top Gainers

          </h2>

          {marketMovers.gainers.map(
            (
              stock,
              index
            ) => (

              <div
                key={index}

                className="market-item"
              >

                <span>

                  {stock.company}

                </span>

                <span className="positive">

                  +{stock.change}%

                </span>

              </div>

            )
          )}

        </div>

        {/* LOSERS */}

        <div className="market-box">

          <h2>

            📉 Top Losers

          </h2>

          {marketMovers.losers.map(
            (
              stock,
              index
            ) => (

              <div
                key={index}

                className="market-item"
              >

                <span>

                  {stock.company}

                </span>

                <span className="negative">

                  {stock.change}%

                </span>

              </div>

            )
          )}

        </div>

      </div>

      {/* TRENDING */}

      <div className="trending-wrapper">

        <h2>

          🔥 Trending Stocks

        </h2>

        <div className="trending-container">

          {trendingStocks.map(
            (
              stock,
              index
            ) => (

              <div
                key={index}

                className="trending-card"

                onClick={() =>
                  fetchStock(
                    stock.ticker,
                    stock.name
                  )
                }
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

                  {stock.change}%

                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* CONTACT */}

      <div className="contact-section">

        <h2>

          📬 Connect With Me

        </h2>

        <div className="contact-links">

          <a
            href="https://www.linkedin.com/in/vatam-prudvi-swar-reddy-b52653297/"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
          >

            💼

          </a>

          <a
            href="https://www.instagram.com/its_prudvi/"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
          >

            📸

          </a>

          <a
            href="mailto:vatamprudvi@gmail.com"
            className="icon-btn"
          >

            ✉️

          </a>

        </div>

      </div>

      {/* FEEDBACK */}

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

      {/* FOOTER */}

      <footer className="footer">

        Built by
        {" "}
        <span>

          Vatam Prudvi Swar

        </span>

        • Powered by Yahoo Finance

      </footer>

    </div>

  );

}

export default App;