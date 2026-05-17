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

  const [error, setError] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(true);

  const [showSearch, setShowSearch] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [trendingStocks, setTrendingStocks] =
    useState([]);

  const [marketMovers, setMarketMovers] =
    useState({
      gainers: [],
      losers: []
    });

  // Fetch Market Movers


useEffect(() => {

  const fetchMarketData = async () => {

    try {

      const response = await fetch(

        "https://stockai-backend-xzm4.onrender.com/market-movers"

      );

      const data = await response.json();

      if (

        data.error ||

        !data.gainers ||

        !data.losers

      ) {

        setMarketMovers({

          gainers: [],

          losers: [],

          error: true

        });

        return;
      }

      setMarketMovers({

        gainers: data.gainers,

        losers: data.losers,

        error: false

      });

    } catch {

      setMarketMovers({

        gainers: [],

        losers: [],

        error: true

      });

    }

  };

  fetchMarketData();

  const interval = setInterval(() => {

    fetchMarketData();

  }, 30000);

  return () => clearInterval(interval);

}, []);

  // Trending Stocks

  useEffect(() => {

    fetch(
      "https://stockai-backend-xzm4.onrender.com/trending"
    )
      .then((res) => res.json())

      .then((data) => {

        setTrendingStocks(data);

      });

  }, []);

  // Live Time

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // Search Stocks

  const searchCompanies = async (
    value
  ) => {

    setQuery(value);

    if (value.length > 1) {

      const response = await fetch(

        `https://stockai-backend-xzm4.onrender.com/search/${value}`

      );

      const data =
        await response.json();

      setSuggestions(data);

    } else {

      setSuggestions([]);
    }
  };

  // Fetch Stock

  const fetchStock = async (

    ticker,
    companyName

  ) => {

    setLoading(true);

    const response = await fetch(

      `https://stockai-backend-xzm4.onrender.com/stock/${ticker}`

    );

    const data =
      await response.json();

    if (data.error) {

      alert(data.error);

      setLoading(false);

      return;
    }

    setStockData(data);

    setQuery(companyName);

    setSuggestions([]);

    setShowChart(true);

    setLoading(false);
  };

  // Investment

  const calculateShares = () => {

    if (!investment || !stockData)
      return 0;

    return Math.floor(

      investment /
      stockData.current_price
    );
  };

  const estimatedReturn = () => {

    if (!investment || !stockData)
      return 0;

    return Math.floor(

      investment *
      (
        stockData.return_percent / 100
      )
    );
  };

  // Indian Time

  const indianTime =
    currentTime.toLocaleTimeString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata"
      }
    );

  // Market Status

  const currentHour =
    new Date(
      currentTime.toLocaleString(
        "en-US",
        {
          timeZone:
            "Asia/Kolkata"
        }
      )
    ).getHours();

  const currentMinute =
    new Date(
      currentTime.toLocaleString(
        "en-US",
        {
          timeZone:
            "Asia/Kolkata"
        }
      )
    ).getMinutes();

  const marketOpen = (

    (
      currentHour > 9
      ||
      (
        currentHour === 9
        &&
        currentMinute >= 15
      )
    )

    &&

    (
      currentHour < 15
      ||
      (
        currentHour === 15
        &&
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

      {/* Glow */}

      <div className="glow-circle glow-1"></div>

      <div className="glow-circle glow-2"></div>

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

      {/* Hero */}

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

        {/* Hero Buttons */}

        <div className="hero-buttons">

          {/* Explore */}

          <button
            className="hero-btn primary-btn"

            onClick={() => {

              setShowSearch(true);

              setTimeout(() => {

                document
                  .getElementById(
                    "explore-section"
                  )
                  ?.scrollIntoView({

                    behavior:
                      "smooth"

                  });

              }, 100);

            }}
          >

            Explore Stocks 🚀

          </button>

          {/* Live Market */}

          <button
            className="hero-btn secondary-btn"

            onClick={() => {

              setShowChart(true);

              document
                .getElementById(
                  "market-section"
                )
                ?.scrollIntoView({

                  behavior:
                    "smooth"

                });

            }}
          >

            Live Market 📈

          </button>

        </div>

      </div>

      {/* Loader */}

      {loading && (

        <div className="loader-container">

          <div className="loader"></div>

          <p>

            Fetching Stock Data...

          </p>

        </div>

      )}

      {/* Error */}

      {error && (

        <div className="error-banner">

          {error}

        </div>

      )}

      {/* Status */}

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

      {/* Search */}

      {showSearch && (

      <div
        className="search-container"
        id="explore-section"
      >

        <input
          type="text"
          placeholder="Search NSE/BSE Stocks, ETFs"

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

      )}

      {/* Trending */}

      <div className="trending-section">

        <h2 className="section-title">

          🔥 Trending Stocks

        </h2>

        <div className="trending-container">

          {trendingStocks.map(
            (stock, index) => (

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

      {marketMovers.error && (

  <div className="error-banner">

    ⚠️ Live market movers are
    temporarily unavailable.

  </div>

)}

      {/* Market Movers */}

      <div
        className="market-section"
        id="market-section"
      >

        {/* Gainers */}

        <div className="market-box">

          <h2>

            📈 Top Gainers

          </h2>

          {marketMovers.gainers.map(
            (stock, index) => (

              <div
                key={index}

                className="market-item"

                onClick={() =>
                  fetchStock(
                    stock.ticker,
                    stock.company
                  )
                }
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

        {/* Losers */}

        <div className="market-box">

          <h2>

            📉 Top Losers

          </h2>

          {marketMovers.losers.map(
            (stock, index) => (

              <div
                key={index}

                className="market-item"

                onClick={() =>
                  fetchStock(
                    stock.ticker,
                    stock.company
                  )
                }
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

      {/* Live Market Graph */}

      {showChart && stockData && (

      <div className="live-market-chart">

        <h2>

          📊 Live Market Trend

        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart
            data={
              stockData.history || []
            }
          >

            <XAxis
              dataKey="date"

              tick={{
                fill: darkMode
                  ? "#fff"
                  : "#0f172a"
              }}
            />

            <YAxis
              tick={{
                fill: darkMode
                  ? "#fff"
                  : "#0f172a"
              }}
            />

            <Tooltip />

            <Line
              type="monotone"

              dataKey="price"

              stroke="#22c55e"

              strokeWidth={3}

              dot={{
                r: 3
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      )}

      {/* Stock Details */}

      {stockData && (

      <div className="main-layout">

        {/* Card */}

        <div className="card">

          <h2>

            {stockData.company}

          </h2>

          <p>

            Current Price:
            ₹{stockData.current_price}

          </p>

          <p>

            Sector:
            {stockData.sector}

          </p>

          <p>

            Risk Level:
            {stockData.risk_level}

          </p>

          <p>

            Predicted Return:
            {stockData.return_percent}%

          </p>

          {/* Investment */}

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
                  {calculateShares()}

                </p>

                <p>

                  Estimated Profit:
                  ₹{estimatedReturn()}

                </p>

              </div>

            )}

          </div>

          {/* Buy */}

          <button

            className="buy-btn"

            onClick={() => {

              const confirmBuy =
                window.confirm(

                  `Continue to buy ${stockData.company}?`
                );

              if (confirmBuy) {

                window.open(

                  `https://groww.in/stocks/${stockData.symbol}`,

                  "_blank"
                );
              }

            }}
          >

            Buy on Groww 🚀

          </button>

        </div>

        {/* News */}

        <div className="side-chart">

          <h2>

            Latest News 📰

          </h2>

          <div className="news-section">

            {stockData.news.map(
              (news, index) => (

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

        </div>

      </div>

      )}

            {/* Contact Section */}

      <div className="contact-section">

        <h2>

          📬 Connect With Me

        </h2>

        <div className="contact-links">

          {/* LinkedIn */}

          <a
            href="https://www.linkedin.com/in/vatam-prudvi-swar-reddy-b52653297/"

            target="_blank"

            rel="noreferrer"

            className="icon-btn linkedin-contact"
          >

            💼

          </a>

          {/* Instagram */}

          <a
            href="https://www.instagram.com/its_prudvi/"

            target="_blank"

            rel="noreferrer"

            className="icon-btn insta-contact"
          >

            📸

          </a>

          {/* Email */}

          <a
            href="mailto:vatamprudvi@gmail.com"

            className="icon-btn email-contact"
          >

            ✉️

          </a>

        </div>

      </div>

      {/* Footer */}

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