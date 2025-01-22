import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPurchasedStocks } from "../../services/StockService";
import UserNavbar from "../../sharedComponents/UserNavbar";
import Footer from "../../sharedComponents/Footer";
import Loader from "../../sharedComponents/Loader";
import { toast } from "react-toastify";

const MyStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // Method to fetch logo dynamically
  const fetchLogoByTicker = async (ticker, stockName) => {
    try {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        stockName
      )}&background=random`;

    } catch (err) {
      toast.error(err.message)
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const purchasedStocks = await fetchPurchasedStocks();
        console.log(purchasedStocks);
        
        // Add dynamic logo fetching for each stock
        const stocksWithLogos = await Promise.all(
          purchasedStocks.map(async (stock) => {
            const logoUrl = await fetchLogoByTicker(stock.ticker, stock.stockName);
            return { ...stock, logo: logoUrl };
          })
        );

        setStocks(stocksWithLogos);

        // Calculate the portfolio value
        let totalValue = 0;
        for (const stock of purchasedStocks) {
          totalValue += stock.quantity * stock.buyPrice;
        }
        setPortfolioValue(totalValue);
      } catch (err) {
        setError("Failed to fetch your stocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (error) return <p className="text-center text-xl mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />
      <main className="flex-grow container mx-auto px-0 py-20">
        <h1 className="text-3xl font-bold text-center mb-10">My Purchased Stocks</h1>

        {/* Display Total Portfolio Value */}
        <div className="text-xl font-semibold text-center mb-6">
          <p>Total Portfolio Value: ${portfolioValue.toFixed(2)}</p>
        </div>

        {/* Loader while loading stocks */}
        {loading ? (
          <Loader message="Loading purchased stocks..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <Link
                key={stock.id}
                to={`/stocks/${stock.ticker}`}
                className="bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center transform transition-transform hover:scale-105"
              >
                <img
                  src={stock.logo}
                  alt={`${stock.stockName} logo`}
                  onError={(e) =>
                  (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    stock.stockName
                  )}&background=random`)
                  }
                  className="w-20 h-20 mb-4 rounded-full border border-gray-300 shadow-sm"
                />
                <h2 className="text-xl font-bold text-gray-700">{stock.stockName}</h2>
                <p className="text-gray-500">{stock.ticker}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Buy Price: ${stock.buyPrice.toFixed(2)}
                </p>
                <p className="text-gray-500">Quantity: {stock.quantity}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyStocks;
