import React, { useState, useEffect, useRef } from "react";
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
  const [totalInvested, setTotalInvested] = useState(0);
  const hasFetched = useRef(false);

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
        let buyValue = 0;
        for (const stock of purchasedStocks) {
          totalValue += stock.quantity * stock.currentPrice;
          buyValue += stock.quantity * stock.buyPrice;
        }
        setPortfolioValue(totalValue);
        setTotalInvested(buyValue);
      } catch (err) {
        setError("Failed to fetch your stocks.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchStocks();
    }

  }, []);

  if (error) return <p className="text-center text-xl mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />
      <main className="flex-grow container mx-auto px-0 py-20">
        <h1 className="text-3xl font-bold text-center mb-10">My Purchased Stocks</h1>

        {/* Display Total Portfolio Value */}
        <div className="text-xl font-semibold text-center mb-6">
          {(() => {
            const difference = portfolioValue - totalInvested;
            const percentage = ((difference / totalInvested) * 100).toFixed(2);
            const isProfit = difference > 0;

            return (
              <>
                {/* Portfolio Value */}
                <p className="mb-2">
                  <span className="text-black">Total Portfolio Value: </span>
                  <span className={isProfit ? "text-green-600" : "text-red-600"}>
                    {portfolioValue !== 0
                      ? `$${portfolioValue.toFixed(2)}`
                      : "Fetching data..."}
                  </span>
                </p>

                {/* Invested Amount */}
                <p>
                  Total Invested Amount:{" "}
                  {totalInvested !== 0
                    ? `$${totalInvested.toFixed(2)}`
                    : "Fetching data..."}
                </p>

                {/* Profit or Loss */}
                <p
                  className={`mt-4 ${isProfit ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {!isNaN(difference) && !isNaN(percentage)
                    ? `${isProfit ? "Profit" : "Loss"}: $${Math.abs(difference).toFixed(
                      2
                    )} (${Math.abs(percentage)}%)`
                    : "Calculating..."}
                </p>              </>
            );
          })()}
        </div>



        {/* Loader while loading stocks */}
        {loading ? (
          <Loader message="Loading purchased stocks..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stocks.map((stock, index) => (
              <Link
                key={stock.id || `${stock.ticker}-${index}`}
                to={`/stocks/${stock.ticker}`}
                className="bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center transform transition-transform hover:scale-105"
              >
                <img
                  src={stock.image}
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

                <p className="text-lg font-semibold  mt-2">

                  Buy Price: ${stock.buyPrice.toFixed(2)}
                </p>
                <p className="text-gray-500 font-semibold">Quantity: {stock.quantity}</p>
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
