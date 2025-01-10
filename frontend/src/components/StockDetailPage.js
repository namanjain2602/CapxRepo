import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../sharedComponents/Navbar";
import Footer from "../sharedComponents/Footer";
import { fetchStockDetails, buyStock } from "../services/StockService";
import UserNavbar from "../sharedComponents/UserNavbar";
import { toast } from "react-toastify";

const StockDetailPage = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(1); // Quantity state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const stockData = await fetchStockDetails(ticker);
        setStock(stockData);
      } catch (err) {
        setError("Failed to fetch stock details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [ticker]);

  const handleBuy = async () => {
    const isLoggedIn = localStorage.getItem("logged") === "user";
    if (!isLoggedIn) {
      toast.warn("Please log in first to buy stocks.");
      //navigate("/login"); // Redirect to login page
      return;
    }

    if (!stock) return;

    const buyData = {
      stockName: stock.name,
      ticker: stock.ticker,
      buyPrice: stock.currentPrice,
      quantity: quantity,
    };

    try {
      await buyStock(buyData); // API call
      toast.success("Stock purchased successfully!");
      navigate("/user-dashboard/my-stocks");
    } catch (err) {
      console.error(err); // Log the error
      toast.error("Failed to buy stock. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-xl mt-10">Loading...</p>;
  if (error) return <p className="text-center text-xl mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {localStorage.getItem("logged") === "user" ? <UserNavbar /> : <Navbar />}
      <main className="flex-grow container mx-auto px-0 py-20">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8">
          {/* Stock Logo */}
          <div className="mb-6">
            <img
              src={stock.logo}
              alt={`${stock.name} logo`}
              className="w-32 h-32 rounded-full border border-gray-300 shadow-sm"
            />
          </div>

         {/* Stock Details */}
<div className="text-center space-y-4">
  {/* Stock Name and Ticker */}
  <h1 className="text-4xl font-bold text-gray-800">
    {stock.name} <span className="text-gray-600">({stock.ticker})</span>
  </h1>
  
  {/* Industry */}
  <p className="text-xl text-gray-600">{stock.finnhubIndustry}</p>
  
  {/* Current Stock Price */}
  <div className="text-2xl font-semibold">
    <p className="text-green-1000">
      Current Stock Price: <span>${stock.currentPrice.toFixed(2)}</span>
    </p>
    
    {/* Total Amount */}
    <p className="text-blue-600">
      Total Amount: <span>${(stock.currentPrice * quantity).toFixed(2)}</span>
    </p>
  </div>
  
  {/* Price Change and Percentage */}
  <p className="text-sm text-gray-500">
    Change: 
    <span className="text-blue-600"> ${stock.priceChange.toFixed(2)}</span> 
    (<span
      className={
        stock.percentageChange >= 0
          ? "text-green-500"
          : "text-red-500"
      }
    >
      {stock.percentageChange.toFixed(2)}%
    </span>)
  </p>
</div>

          <p className="text-sm mt-2 text-gray-500">
            <b>Market Capitalization: </b>${stock.marketCapitalization.toFixed(2)}M
          </p>
          <a
            href={stock.weburl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-4"
          >
            Visit Company Website
          </a>

                  {/* Quantity Selector */}
          <div className="flex items-center mt-6 space-x-4">
            {/* Decrement Button */}
            <button
              onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
              className="bg-gray-200 px-3 py-1 rounded-full text-lg font-bold"
            >
              -
            </button>

            {/* Quantity Input */}
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, parseInt(e.target.value) || 1);
                setQuantity(value);
              }}
              className="w-16 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            />

            {/* Increment Button */}
            <button
              onClick={() => setQuantity((prevQuantity) => prevQuantity + 1)}
              className="bg-gray-200 px-3 py-1 rounded-full text-lg font-bold"
            >
              +
            </button>
          </div>


          {/* Buy Button */}
          <button
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-full mt-6 text-lg font-bold hover:shadow-lg hover:opacity-90 transition duration-300"
            onClick={handleBuy}
          >
            Buy
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StockDetailPage;
