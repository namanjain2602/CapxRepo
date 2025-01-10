import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStocks } from "../services/StockService";
import Login from "../components/authComponents/Login";
import Register from "../components/authComponents/Register";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await fetchStocks(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => fetchSearchResults(), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10 shadow-md">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <span role="img" aria-label="logo">
            📊
          </span>
          <span>CapGro</span>
        </Link>
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search stocks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
          />
          {searchResults.length > 0 ? (
            <ul className="absolute left-0 right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg max-h-60 overflow-auto z-10">
              {searchResults.map((stock) => (
                <li key={stock.symbol} className="px-4 py-2 hover:bg-gray-100">
                  <Link to={`/stock/${stock.symbol}`} className="block">
                    {stock.description} ({stock.symbol})
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !isSearching &&
            searchTerm.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg p-4">
                <p>No results found.</p>
              </div>
            )
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Modals */}
      <Login isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Register isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
};

export default Navbar;
