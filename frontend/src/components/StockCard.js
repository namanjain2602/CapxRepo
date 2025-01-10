import React from "react";
import { Link } from "react-router-dom";
import DummyImage from "../images/dummyImage.png";
const StockCard = ({ stock }) => {
  const renderChange = (change) => {
    const parsedChange = parseFloat(change);
    if (isNaN(parsedChange)) {
      return "-"; 
    }
    return parsedChange > 0 ? (
      <span className="text-green-600">{change}</span>
    ) : (
      <span className="text-red-600">{change}</span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer flex flex-col sm:flex-row items-start sm:items-center ">
      {/* Text Section */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 truncate">{stock.name}</h2>
        <p className="text-sm text-gray-600">{stock.ticker}</p>
        <p className="text-lg font-semibold mt-2">{stock.price}</p>
        <p className="text-sm mt-1">{renderChange(stock.change)}</p>
        <Link
          to={`/stock/${stock.ticker}`}
          className="text-blue-500 mt-2 inline-block"
        >
          View Details
        </Link>
      </div>

      {/* Image Section */}
      <div className="w-32 h-32 ml-4 mt-4 sm:mt-0 overflow-hidden rounded-lg bg-white flex justify-center items-center">
        <img
          src={stock.image}
          alt={DummyImage}
          className="object-contain h-full w-full"
          onError={(e) =>
            (e.target.src = {DummyImage})
          }
        />
      </div>
    </div>
  );
};

export default StockCard;
