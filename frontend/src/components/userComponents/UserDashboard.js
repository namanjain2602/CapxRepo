import React, { useState, useEffect } from "react";
import StockCard from "../StockCard";
import { fetchRecommendedStocks } from "../../services/StockService";
import UserNavbar from "../../sharedComponents/UserNavbar";
import Loader from "../../sharedComponents/Loader";

const UserDashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true); // For loading recommended stocks
  const [error, setError] = useState(null);

  // Function to fetch logo by ticker
  const fetchLogoByTicker = async (ticker, stockName) => {
    try {
      const logoApiUrl = `https://logo.clearbit.com/${ticker.toLowerCase()}.com`;
      const response = await fetch(logoApiUrl);
      if (response.ok) {
        return logoApiUrl;
      } else {
        // Fallback to ui-avatars
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          stockName
        )}&background=random`;
      }
    } catch (err) {
      // Fallback to ui-avatars
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        stockName
      )}&background=random`;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch portfolio from localStorage
        const portfolioData = JSON.parse(localStorage.getItem("users") || "[]");
        setPortfolio(portfolioData);

        // Fetch recommended stocks from API
        setLoadingRecommended(true); // Set loading state for recommended stocks
        const recommendedStocksData = await fetchRecommendedStocks();

        // Fetch logos for each recommended stock
        const recommendedStocksWithLogos = await Promise.all(
          recommendedStocksData.map(async (stock) => {
            const logoUrl = await fetchLogoByTicker(stock.ticker, stock.name);
            return { ...stock, image: logoUrl };
          })
        );

        setRecommendedStocks(recommendedStocksWithLogos);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
        setLoadingRecommended(false); // Stop loading state for recommended stocks
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />
      <main className="flex-grow pt-20 px-6">
        <h1 className="text-3xl font-bold text-center my-6 text-gray-700">User Dashboard</h1>
        
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
              <ul>
                {portfolio.length > 0 ? (
                  portfolio.map((stock, index) => (
                    <li key={index} className="py-2 border-b">
                      <span className="font-semibold">{stock.name}</span> - 
                      {stock.shares} shares @ ${stock.price ? stock.price.toFixed(2) : "N/A"}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-700">No stocks in portfolio.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Recommended Stocks */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">Recommended Stocks</h2>
          {loadingRecommended ? (
            <Loader message="Loading recommended stocks..."/> // Loader message
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedStocks.length > 0 ? (
                recommendedStocks.map((stock, index) => (
                  <StockCard
                    key={index}
                    stock={{
                      name: stock.name || "N/A",
                      ticker: stock.ticker || "N/A",
                      currentPrice: stock.currentPrice || 0,
                      priceChange: stock.priceChange || 0,
                      percentageChange: stock.percentageChange || 0,
                      image: stock.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        stock.name || "Stock"
                      )}&background=random`, // Dynamic fallback image
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-700 text-center w-full">No recommended stocks available.</p>
              )}
            </div>
          )}
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center mt-5">
        <p>&copy; 2025 CapGro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
