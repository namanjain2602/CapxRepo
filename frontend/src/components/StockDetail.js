import React from "react";

const StockDetail = ({ stock, onClose }) => {
  const renderChange = (change) => {
    const parsedChange = parseFloat(change);
    if (isNaN(parsedChange)) {
      return "-"; // Fallback if change is not a valid number
    }
    return parsedChange > 0 ? (
      <span className="text-green-600">{change}</span>
    ) : (
      <span className="text-red-600">{change}</span>
    );
  };

  return (
    <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {stock.name} ({stock.ticker})
      </h2>
      <p className="text-lg mt-2">{stock.details}</p>
      <p className="text-lg font-semibold mt-2">Price: {stock.price}</p>
      <p className="text-sm mt-1">{renderChange(stock.change)}</p>
      <button
        className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default StockDetail;
