from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import requests
import feedparser
import pytz

from datetime import datetime

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STOCK DATABASE
# =========================

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

# =========================
# SEARCH API
# =========================

@app.get("/search/{query}")

def search_stock(query: str):

    results = []

    for stock in stock_database:

        if query.lower() in stock["name"].lower():

            results.append(stock)

    return results

# =========================
# TRENDING STOCKS
# =========================

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

# =========================
# LIVE TOP GAINERS & LOSERS
# =========================

@app.get("/market-movers")

def market_movers():

    try:

        # FETCH LIVE NIFTY50 STOCKS

        nifty_url = (
            "https://archives.nseindia.com/content/indices/ind_nifty50list.csv"
        )

        response = requests.get(nifty_url)

        csv_data = response.text.splitlines()

        stocks = []

        # SKIP HEADER

        for line in csv_data[1:]:

            try:

                columns = line.split(",")

                symbol = columns[2]

                stocks.append(
                    symbol + ".NS"
                )

            except:
                continue

        market_data = []

        for ticker in stocks:

            try:

                stock = yf.Ticker(ticker)

                hist = stock.history(period="2d")

                if hist.empty or len(hist) < 2:
                    continue

                latest = hist["Close"].iloc[-1]

                previous = hist["Close"].iloc[-2]

                change = round(

                    ((latest - previous) / previous) * 100,

                    2
                )

                company_name = stock.info.get(
                    "shortName",
                    ticker.replace(".NS", "")
                )

                market_data.append({

                    "company":
                    company_name,

                    "change":
                    change,

                    "ticker":
                    ticker

                })

            except:
                continue

        # TOP GAINERS

        gainers = sorted(

            market_data,

            key=lambda x: x["change"],

            reverse=True

        )[:7]

        # TOP LOSERS

        losers = sorted(

            market_data,

            key=lambda x: x["change"]

        )[:7]

        return {

            "top_gainers": gainers,

            "top_losers": losers

        }

    except Exception as e:

        return {

            "error": str(e)

        }

# =========================
# MARKET HOLIDAYS
# =========================

@app.get("/market-holidays")

def market_holidays():

    holidays = [

        {

            "name": "Republic Day",

            "date": "26 Jan"

        },

        {

            "name": "Holi",

            "date": "14 Mar"

        },

        {

            "name": "Independence Day",

            "date": "15 Aug"

        },

        {

            "name": "Gandhi Jayanti",

            "date": "2 Oct"

        },

        {

            "name": "Diwali",

            "date": "21 Oct"

        },

        {

            "name": "Christmas",

            "date": "25 Dec"

        }

    ]

    return holidays

# =========================
# MARKET STATUS
# =========================

@app.get("/market-status")

def market_status():

    india = pytz.timezone(
        "Asia/Kolkata"
    )

    now = datetime.now(india)

    hour = now.hour

    minute = now.minute

    day = now.weekday()

    is_weekend = day >= 5

    market_open = (

        not is_weekend and

        (
            (
                hour > 9 or
                (
                    hour == 9 and
                    minute >= 15
                )
            )

            and

            (
                hour < 15 or
                (
                    hour == 15 and
                    minute <= 30
                )
            )
        )
    )

    return {

        "market_open": market_open,

        "time": now.strftime(
            "%I:%M:%S %p"
        )

    }

# =========================
# STOCK DETAILS
# =========================

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

        # GRAPH DATA

        history_data = []

        for index, row in hist.iterrows():

            history_data.append({

                "date":
                index.strftime("%d-%b"),

                "price":
                round(row["Close"], 2)

            })

        # NEWS

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