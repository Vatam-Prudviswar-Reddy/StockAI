from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import feedparser

app = FastAPI()

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# STOCK DATABASE

stock_database = [

    {
        "symbol": "RELIANCE.NS",
        "name": "Reliance Industries Limited"
    },

    {
        "symbol": "TCS.NS",
        "name": "Tata Consultancy Services"
    },

    {
        "symbol": "INFY.NS",
        "name": "Infosys Limited"
    },

    {
        "symbol": "HDFCBANK.NS",
        "name": "HDFC Bank Limited"
    },

    {
        "symbol": "SBIN.NS",
        "name": "State Bank Of India"
    },

    {
        "symbol": "BHARTIARTL.NS",
        "name": "Bharti Airtel Limited"
    },

    {
        "symbol": "ITC.NS",
        "name": "ITC Limited"
    },

    {
        "symbol": "LT.NS",
        "name": "Larsen & Toubro Limited"
    },

    {
        "symbol": "TATAMOTORS.NS",
        "name": "Tata Motors Limited"
    },

    {
        "symbol": "AXISBANK.NS",
        "name": "Axis Bank Limited"
    }
]

# SEARCH API

@app.get("/search/{query}")

def search_stock(query: str):

    results = []

    for stock in stock_database:

        if query.lower() in stock["name"].lower():

            results.append(stock)

    return results

# TRENDING STOCKS

@app.get("/trending")

def trending_stocks():

    trending = [

        "RELIANCE.NS",
        "INFY.NS",
        "SBIN.NS",
        "BHARTIARTL.NS",
        "TCS.NS"
    ]

    result = []

    for ticker in trending:

        stock = yf.Ticker(ticker)

        hist = stock.history(period="5d")

        if hist.empty:
            continue

        latest = hist["Close"].iloc[-1]

        previous = hist["Close"].iloc[-2]

        change = round(
            ((latest - previous) / previous) * 100,
            2
        )

        result.append({

            "ticker": ticker,

            "name": stock.info.get(
                "longName",
                ticker
            ),

            "change": change
        })

    return result

# MARKET MOVERS

@app.get("/market-movers")
def market_movers():

    try:

        stocks = [

            ("RELIANCE.NS", "Reliance"),
            ("TCS.NS", "TCS"),
            ("INFY.NS", "Infosys"),
            ("HDFCBANK.NS", "HDFC Bank"),
            ("ICICIBANK.NS", "ICICI Bank")

        ]

        data = []

        for symbol, company in stocks:

            stock = yf.Ticker(symbol)

            hist = stock.history(period="2d")

            if len(hist) < 2:
                continue

            prev_close = hist["Close"].iloc[-2]

            current = hist["Close"].iloc[-1]

            change = round(
                ((current - prev_close) / prev_close) * 100,
                2
            )

            data.append({

                "ticker": symbol,
                "company": company,
                "change": change

            })

        gainers = sorted(
            data,
            key=lambda x: x["change"],
            reverse=True
        )[:5]

        losers = sorted(
            data,
            key=lambda x: x["change"]
        )[:5]

        return {

            "gainers": gainers,
            "losers": losers

        }

    except Exception as e:

        return {
            "error": str(e)
        }

# STOCK DETAILS

@app.get("/stock/{ticker}")

def get_stock(ticker: str):

    try:

        stock = yf.Ticker(ticker)

        info = stock.info

        hist = stock.history(period="7d")

        if hist.empty:

            return {

                "error": "No stock data found"
            }

        current_price = round(

            hist["Close"].iloc[-1],

            2
        )

        predicted_return = 15

        beta = info.get("beta", 1)

        risk_level = "Medium"

        if beta < 0.8:

            risk_level = "Low"

        elif beta > 1.2:

            risk_level = "High"

        # Graph Data

        history_data = []

        for index, row in hist.iterrows():

            history_data.append({

                "date":
                index.strftime("%d-%b"),

                "price":
                round(row["Close"], 2)
            })

        # News

        news_feed = feedparser.parse(

            f"https://news.google.com/rss/search?q={ticker}+stock"
        )

        news = []

        for entry in news_feed.entries[:5]:

            news.append({

                "title": entry.title,

                "link": entry.link
            })

        return {

            "company":
            info.get("longName", ticker),

            "symbol":
            ticker,

            "sector":
            info.get("sector", "Unknown"),

            "current_price":
            current_price,

            "return_percent":
            predicted_return,

            "risk_level":
            risk_level,

            "history":
            history_data,

            "news":
            news
        }

    except Exception as e:

        return {

            "error": str(e)
        }