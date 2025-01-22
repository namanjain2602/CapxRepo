import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPurchasedStockInfo,
  buyStock,
  sellStock,
} from "../../services/StockService";
import UserNavbar from "../../sharedComponents/UserNavbar";
import Footer from "../../sharedComponents/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuyAndSellStock = () => {
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const stockDetails = await fetchPurchasedStockInfo(id);
        setStock(stockDetails);

      } catch (err) {
        toast.error("Failed to fetch stock details.");
      }
    };

    fetchStockDetails();
  }, [id]);

  const handleBuy = async () => {
    try {
      const payload = {
        stockName: stock.stockName,
        ticker: stock.ticker,
        buyPrice: stock.currentPrice,
        quantity: quantity,
      };
      await buyStock(payload);
      toast.success(`${quantity} shares of ${stock.stockName} bought successfully!`);
      setStock((prev) => ({
        ...prev,
        quantity: prev.quantity + quantity,
      }));
      //navigate("/user-dashboard/my-stocks")
    } catch (err) {
      toast.error("Failed to buy stock.");
    }
  };

  const handleSell = async () => {
    if (quantity > stock.quantity) {
      toast.warn("Cannot sell more than owned quantity.");
      return;
    }
    try {
      await sellStock(stock.ticker, quantity);
      toast.success(`${quantity} shares sold successfully!`);
      setStock((prev) => ({
        ...prev,
        quantity: prev.quantity - quantity,
      }));
      //navigate("/user-dashboard/my-stocks")
    } catch (err) {
      toast.error("Failed to sell stock.");
    }
  };

  if (!stock) return <p className="text-center text-xl mt-10">Loading...</p>;

  // Determine styles based on profit/loss and current vs. purchase value
  const isProfit = stock.profitLossAmount >= 0;
  const isCurrentValueGreaterThanPurchase = stock.totalCurrentValue > stock.totalPurchasedValue;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <UserNavbar />
      <main className="flex-grow container mx-auto px-0 py-20">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
          <img
            src={ stock.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(
              stock.stockName || "Stock"
            )}&background=random`}
            alt={stock.stockName || "Stock Logo"}
            className="w-32 h-32 mx-auto mb-4 rounded-full border shadow-sm"
          />
          <h1 className="text-2xl font-bold text-center mb-4">{stock.stockName}</h1>
          <p className="text-center text-gray-500">{stock.ticker}</p>

          <div className="text-center text-lg space-y-4 my-6">
            {/* Purchase Price */}
            <div className="flex justify-between">
              <span className="font-bold">Purchase Price:</span>
              <span className="text-gray-700">${stock.purchasePrice.toFixed(2)}</span>
            </div>

            {/* Current Price */}
            <div className="flex justify-between">
              <span className="font-bold">Current Price:</span>
              <span className={`text-lg font-semibold ${isCurrentValueGreaterThanPurchase ? "text-green-600" : "text-red-600"}`}>
                ${stock.currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Price Change */}
            <div className="flex justify-between">
              <span className="font-bold">Price Change:</span>
              <span className={stock.priceChangeAmount >= 0 ? "text-green-600" : "text-red-600"}>
                ${stock.priceChangeAmount.toFixed(2)} ({stock.priceChangePercentage.toFixed(2)}%)
              </span>
            </div>

            {/* Owned Quantity */}
            <div className="flex justify-between">
              <span className="font-bold">Owned Quantity:</span>
              <span className="text-gray-700">{stock.quantity}</span>
            </div>

            {/* Total Purchased Value */}
            <div className="flex justify-between">
              <span className="font-bold">Total Purchased Value:</span>
              <span className={`text-lg ${stock.totalPurchasedValue > stock.totalCurrentValue ? "text-red-600" : "text-green-600"}`}>
                ${stock.totalPurchasedValue.toFixed(2)}
              </span>
            </div>

            {/* Total Current Value */}
            <div className="flex justify-between">
              <span className="font-bold">Total Current Value:</span>
              <span className={`text-lg ${isCurrentValueGreaterThanPurchase ? "text-green-600" : "text-red-600"}`}>
                ${stock.totalCurrentValue.toFixed(2)}
              </span>
            </div>

            {/* Profit/Loss */}
            <div className="flex justify-between">
              <span className="font-bold">Profit/Loss:</span>
              <span className={isProfit ? "text-green-600" : "text-red-600"}>
                ${stock.profitLossAmount.toFixed(2)} ({stock.profitLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <label className="text-gray-700 font-medium">
              Quantity:
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="ml-2 px-2 py-1 border rounded-md w-20"
              />
            </label>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={handleBuy}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              Buy
            </button>
            <button
              onClick={handleSell}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              Sell
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuyAndSellStock;
