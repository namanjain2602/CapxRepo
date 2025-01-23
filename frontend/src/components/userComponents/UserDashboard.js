import React, { useState, useEffect, useRef } from "react";
import StockCard from "../stockComponents/StockCard";
import { fetchPurchasedStocks, fetchRecommendedStocks } from "../../services/StockService";
import UserNavbar from "../../sharedComponents/UserNavbar";
import Loader from "../../sharedComponents/Loader";

const UserDashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true); // For loading recommended stocks
  const [error, setError] = useState(null);

  const [visibleCount, setVisibleCount] = useState(3);

  const hasFetched = useRef(false);

  const handleToggleView = () => {
    setVisibleCount((prev) =>
      prev < recommendedStocks.length - 2 ? prev + 3 : 3
    );
  };

  useEffect(() => {

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch portfolio from localStorage
        const purchasedStocks = await fetchPurchasedStocks();

        //console.log(purchasedStocks);

        setPortfolio(purchasedStocks);

        // Fetch recommended stocks from API
        setLoadingRecommended(true); // Set loading state for recommended stocks
        const recommendedStocksData = await fetchRecommendedStocks();



        setRecommendedStocks(recommendedStocksData);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
        setLoadingRecommended(false); // Stop loading state for recommended stocks
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      loadDashboardData();
    }

  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />
      <main className="flex-grow pt-20 px-6">
        <h1 className="text-3xl font-bold text-center my-6 text-blue-700">
          Welcome , {localStorage.getItem("name")}
        </h1>

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Portfolio Stocks Section */}
        {/* Portfolio Stocks Section */}
        <section className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-6">Current Holdings</h2>
          {loading ? (
            <Loader message="Loading your portfolio..." />
          ) : (
            <div className="flex justify-center">
              {/* Horizontal Scroll Container */}
              <div className="relative w-full max-w-5xl">
                {/* Left Scroll Button */}
                <button
                  className="hidden sm:flex absolute top-1/2 left-[-5rem] z-10 h-10 w-10 bg-gray-100 hover:bg-gray-400 rounded-full justify-center items-center shadow-lg transition transform -translate-y-1/2"
                  onClick={() =>
                    document.getElementById("portfolioScroll").scrollBy({
                      left: -300,
                      behavior: "smooth",
                    })
                  }
                >
                  &#8249;
                </button>

                <div
                  id="portfolioScroll"
                  className="flex gap-4 py-4 overflow-x-auto scroll-smooth px-8"
                >
                  {portfolio.length > 0 ? (
                    portfolio.map((stock, index) => (
                      <a
                        key={index}
                        href={`/stocks/${stock.ticker}`}
                        className="min-w-[250px] bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-lg p-4 hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 group"
                      >
                        {/* Stock Logo */}
                        <img
                          src={
                            stock.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              stock.stockName || "Stock"
                            )}&background=random`
                          }
                          alt={stock.stockName}
                          className="h-20 w-20 mx-auto rounded-full mb-4 border border-gray-300"
                        />
                        {/* Stock Info */}
                        <h3 className="text-lg font-semibold text-center text-gray-700 group-hover:text-blue-600">
                          {stock.stockName || "N/A"}
                        </h3>
                        <p className="text-sm text-center text-gray-500">
                          {stock.ticker || "N/A"}
                        </p>
                        <div className="text-center mt-4">
                          <p className="text-gray-600 text-sm">
                            Buy Price:{" "}
                            <span className="text-gray-800 font-bold">
                              ${stock.buyPrice || 0}
                            </span>
                          </p>
                          <p className="text-gray-600 text-sm">
                            Quantity:{" "}
                            <span className="text-gray-800 font-bold">
                              {stock.quantity || 0}
                            </span>
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-700 text-center w-full">
                      No stocks in your portfolio.
                    </p>
                  )}
                </div>

                {/* Right Scroll Button */}
                <button
                  className="hidden sm:flex absolute top-1/2 right-[-5rem] z-10 h-10 w-10 bg-gray-100 hover:bg-gray-400 rounded-full justify-center items-center shadow-lg transition transform -translate-y-1/2"
                  onClick={() =>
                    document.getElementById("portfolioScroll").scrollBy({
                      left: 300,
                      behavior: "smooth",
                    })
                  }
                >
                  &#8250;
                </button>
              </div>
            </div>
          )}
        </section>



        <section className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            Recommended Stocks
          </h2>
          {loadingRecommended ? (
            <Loader message="Loading recommended stocks..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedStocks.length > 0 ? (
                recommendedStocks.slice(0, visibleCount).map((stock, index) => (
                  <StockCard
                    key={index}
                    stock={{
                      name: stock.name || "N/A",
                      ticker: stock.ticker || "N/A",
                      currentPrice: stock.currentPrice || 0,
                      priceChange: stock.priceChange || 0,
                      percentageChange: stock.percentageChange || 0,
                      image:
                        stock.logo || // Ensure the logo field is used if available
                        stock.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          stock.name || "Stock"
                        )}&background=random`,
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-700 text-center w-full">
                  No recommended stocks available.
                </p>
              )}
            </div>
          )}
          {/* Toggle View Button */}
          {!loadingRecommended && recommendedStocks.length > visibleCount && (
            <div className="text-center mt-6">
              <button
                onClick={handleToggleView}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                {visibleCount < recommendedStocks.length - 2 ? "View More" : "View Less"}
              </button>
            </div>
          )}
        </section>

      </main>
      <footer className="bg-gray-800 text-white py-4 text-center mt-5">
        <p>&copy; 2025 CapGro. All rights reserved.</p>
      </footer>
    </div>
  )
};

export default UserDashboard;
