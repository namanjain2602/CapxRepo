import React from "react";
import { Link } from "react-router-dom";
import DummyImage from "../../images/dummyImage.png";


const StockCard = ({ stock }) => {
  const renderChange = (change) => {
    const parsedChange = parseFloat(change);
    if (isNaN(parsedChange)) {
      return "-";
    }
    return parsedChange > 0 ? (
      <span className="text-green-600">{change}%</span>
    ) : (
      <span className="text-red-600">{change}%</span>
    );
  };

  return (
    <Link
      to={`/stock/${stock.ticker}`}
      aria-label={`View details for ${stock.name || "Unnamed Stock"}`}
      className="block bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer flex flex-col sm:flex-row items-start sm:items-center"
    >
      <div className="flex-1">
        <h2
          className="text-xl font-bold text-gray-800 truncate"
          title={stock.name && stock.name.length > 30 ? stock.name : ""} // Show full name on hover
        >
          {stock.name && stock.name.length > 30
            ? `${stock.name.slice(0, 27)}...`
            : stock.name || "Unnamed Stock"}
        </h2>
        <p className="text-sm text-gray-600">
          {stock.ticker || "Unknown Ticker"}
        </p>
        <p className="text-lg font-semibold mt-2">$
          {stock.currentPrice !== undefined && stock.currentPrice !== null
            ? stock.currentPrice
            : stock.price || "N/A"}
        </p>
        <p className="text-sm mt-1">
          {stock.percentageChange !== undefined && stock.percentageChange !== null
            ? renderChange(stock.percentageChange)
            : renderChange(stock.priceChange || stock.change)}
        </p>
      </div>

      {/* Image Section */}
      <div className="w-32 h-32 ml-4 mt-4 sm:mt-0 overflow-hidden rounded-lg bg-white flex justify-center items-center">
        <img
          src={stock.image}
          alt="Stock"
          className="object-contain h-full w-full"
          onError={(e) => (e.target.src = DummyImage)}
        />
      </div>
    </Link>
  );
};

export default StockCard;
