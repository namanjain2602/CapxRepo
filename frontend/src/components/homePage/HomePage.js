import React, { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dummyStocks = [
    {
      name: "Apple",
      ticker: "AAPL",
      price: "$175.34",
      change: "+1.23%",
      details:
        "Apple Inc. designs, manufactures, and markets smartphones, tablets, and personal computers.",
    },
    {
      name: "Tesla",
      ticker: "TSLA",
      price: "$265.48",
      change: "-0.75%",
      details: "Tesla, Inc. is an electric vehicle and clean energy company.",
    },
    {
      name: "Amazon",
      ticker: "AMZN",
      price: "$138.27",
      change: "+2.34%",
      details:
        "Amazon.com, Inc. engages in e-commerce, cloud computing, and artificial intelligence.",
    },
    {
      name: "Google",
      ticker: "GOOGL",
      price: "$127.95",
      change: "+0.89%",
      details:
        "Google LLC focuses on online advertising, search engines, and technology services.",
    },
    {
      name: "Microsoft",
      ticker: "MSFT",
      price: "$314.56",
      change: "-0.12%",
      details:
        "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions.",
    },
  ];

  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10 shadow-md">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <span role="img" aria-label="logo">
            📊
          </span>
          <span>CapGro</span>
        </Link>

        {/* Search Bar */}
        <div className="w-full max-w-lg">
          <input
            type="text"
            placeholder="Search stocks"
            className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-6">
        <h1 className="text-3xl font-bold text-center my-6 text-gray-700">
          Explore Top Stocks
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyStocks.map((stock, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedStock(stock)}
            >
              <h2 className="text-xl font-bold text-gray-800">{stock.name}</h2>
              <p className="text-sm text-gray-600">{stock.ticker}</p>
              <p className="text-lg font-semibold mt-2">{stock.price}</p>
              <p
                className={`text-sm mt-1 ${
                  stock.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stock.change}
              </p>
            </div>
          ))}
        </div>
        {selectedStock && (
          <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedStock.name} ({selectedStock.ticker})
            </h2>
            <p className="text-lg mt-2">{selectedStock.details}</p>
            <p className="text-lg font-semibold mt-2">
              Price: {selectedStock.price}
            </p>
            <p
              className={`text-lg mt-1 ${
                selectedStock.change.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Change: {selectedStock.change}
            </p>
            <button
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              onClick={() => setSelectedStock(null)}
            >
              Close
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 left-0 right-0">
        <p>&copy; 2025 CapGro. All rights reserved.</p>
        <p>Powered by React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default HomePage;
