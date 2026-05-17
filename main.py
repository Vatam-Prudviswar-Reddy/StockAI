from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import requests
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

    try:

        stocks = [

            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "SBIN.NS",
            "ITC.NS",
            "LT.NS",
            "BHARTIARTL.NS",
            "AXISBANK.NS",
            "TATAMOTORS.NS",
            "ICICIBANK.NS",
            "KOTAKBANK.NS",
            "ASIANPAINT.NS",
            "MARUTI.NS",
            "SUNPHARMA.NS",
            "WIPRO.NS",
            "ULTRACEMCO.NS",
            "POWERGRID.NS",
            "BAJFINANCE.NS",
            "HCLTECH.NS",
            "ADANIENT.NS",
            "ADANIPORTS.NS",
            "NTPC.NS",
            "ONGC.NS",
            "TECHM.NS",
            "TITAN.NS",
            "NESTLEIND.NS",
            "COALINDIA.NS",
            "INDUSINDBK.NS",
            "JSWSTEEL.NS"

        ]

        result = []

        for ticker in stocks:

            try:

                stock = yf.Ticker(ticker)

                hist = stock.history(period="5d")

                if hist.empty or len(hist) < 2:
                    continue

                latest = hist["Close"].iloc[-1]

                previous = hist["Close"].iloc[-2]

                change = round(

                    ((latest - previous) / previous) * 100,

                    2
                )

                volume = hist["Volume"].iloc[-1]

                result.append({

                    "ticker": ticker,

                    "name": stock.info.get(
                        "longName",
                        ticker
                    ),

                    "change": change,

                    "volume": int(volume)

                })

            except:
                continue

        # Live ranking logic

        trending = sorted(

            result,

            key=lambda x: (
                abs(x["change"]),
                x["volume"]
            ),

            reverse=True

        )[:6]

        return trending

    except Exception as e:

        return {

            "error": str(e)
        }

# MARKET MOVERS

@app.get("/market-movers")

def market_movers():

    try:

        headers = {

            "User-Agent":
            "Mozilla/5.0"

        }

        session = requests.Session()

        # Visit NSE first
        session.get(
            "https://www.nseindia.com",
            headers=headers
        )

        # Top Gainers
        gainers_url = (
            "https://www.nseindia.com/api/"
            "live-analysis-variations?index=gainers"
        )

        gainers_response = session.get(
            gainers_url,
            headers=headers
        )

        gainers_data = gainers_response.json()

        gainers = []

        for item in gainers_data["NIFTY"][:5]:

            gainers.append({

                "company":
                item["symbol"],

                "change":
                round(
                    item["percentChange"],
                    2
                ),

                "ticker":
                item["symbol"] + ".NS"
            })

        # Top Losers
        losers_url = (
            "https://www.nseindia.com/api/"
            "live-analysis-variations?index=losers"
        )

        losers_response = session.get(
            losers_url,
            headers=headers
        )

        losers_data = losers_response.json()

        losers = []

        for item in losers_data["NIFTY"][:5]:

            losers.append({

                "company":
                item["symbol"],

                "change":
                round(
                    item["percentChange"],
                    2
                ),

                "ticker":
                item["symbol"] + ".NS"
            })

        return {

            "gainers": gainers,

            "losers": losers
        }

    except Exception as e:

        return {

            "error": str(e)
        }

        # Dynamic Sorting
        gainers = sorted(

            [

                stock for stock in market_data

                if stock["change"] > 0

            ],

            key=lambda x: x["change"],

            reverse=True

        )[:5]

        losers = sorted(

            [

                stock for stock in market_data

                if stock["change"] < 0

            ],

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