import axios from "axios";


const BASE_URL = process.env.REACT_APP_API_URL
const FINNHUB_API_KEY = "ctsl7qpr01qin3c01ofgctsl7qpr01qin3c01og0";



export const fetchTopProfitableStocks = async () => {
  const apiUrl = `${BASE_URL}/api/stocks/recommendations`;

  

  try {
    const response = await axios.get(apiUrl);
    const stockDetails = response.data.map((stock) => ({
      name: stock.name,
      ticker: stock.ticker,
      price: `${stock.currentPrice.toFixed(2)}`,
      change: `${stock.percentageChange.toFixed(2)}%`,
      image: stock.logo,
    }));

    return stockDetails;
  } catch (error) {
    console.error("Error fetching stock recommendations:", error.message);
    return [];
  }
};


/**
 * Fetch stock details from the backend.
 */
export const fetchStockDetails = async (ticker) => {
  if (!ticker) throw new Error("Ticker symbol is required to fetch stock details.");

  try {
    const response = await axios.get(`${BASE_URL}/api/stocks/details/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock details for ${ticker}:`, error.message);
    throw error;
  }
};

/**
 * Fetch stock history from Finnhub.
 */
export const fetchStockHistory = async (symbol, start, end) => {
  const apiUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${start}&to=${end}&token=${FINNHUB_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.s !== "ok") {
      throw new Error(`Failed to fetch historical data for ${symbol}: ${response.data.s}`);
    }

    const { t, c } = response.data; // t: timestamps, c: close prices
    return t.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split("T")[0],
      price: c[index],
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error.message);
    throw error;
  }
};

/**
 * Fetch stocks by query from the backend.
 */
export const fetchStocks = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/stocks/search`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks:", error.message);
    throw error;
  }
};


export const fetchRecommendedStocks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/stocks/recommendations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended stocks:", error.message);
    throw error;
  }
};

/**
 * Buy a stock by sending data to the backend.
 */
export const buyStock = async (stockData) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post(`${BASE_URL}/api/stocks`, stockData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error buying stock:", error.message);
    throw error;
  }
};

/**
 * Sell a stock by sending a request to the backend.
 */
export const sellStock = async (ticker, quantity) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/stocks/${ticker}/${quantity}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error selling stock (${ticker}):`, error.message);
    throw error;
  }
};

/**
 * Fetch purchased stocks from the backend.
 */
export const fetchPurchasedStocks = async () => {
  const accessToken = localStorage.getItem("token")

  try {
    const response = await axios.get(`${BASE_URL}/api/stocks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching purchased stocks:", error.message);
    throw error;
  }
};


/**
 * Fetch the current price of a stock.
 */
export const fetchStockPrice = async (ticker) => {
  try {
    const stockDetails = await fetchStockDetails(ticker);
    return stockDetails.currentPrice;
  } catch (error) {
    console.error("Error fetching stock price:", error.message);
    throw error;
  }
};

/**
 * Fetch purchased stock info by ticker.
 */
export const fetchPurchasedStockInfo = async (ticker) => {
  if (!ticker) throw new Error("Ticker symbol is required to fetch stock info.");

  try {
    // Sending ticker as a request parameter
    const response = await axios.get(`${BASE_URL}/api/stocks/info`, { params: { ticker } });
      
    
    return response.data; // Return the data received from the backend
  } catch (error) {
    console.error(`Error fetching stock info for ${ticker}:`, error.message);
    throw error;
  }
};




