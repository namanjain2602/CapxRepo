// components/Navbar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import Login from "../components/authComponents/Login";
import Register from "../components/authComponents/Register";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Handle stock selection from the search results
  const handleStockSelect = (stock) => {
    window.location.href = `/stock/${stock.symbol}`;
  };

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
        <SearchBar onSelectStock={handleStockSelect} /> {/* Use SearchBar component */}
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
