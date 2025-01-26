import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Login from "../components/authComponents/Login";
import Register from "../components/authComponents/Register";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStockSelect = (stock) => {
    window.location.href = `/stock/${stock.symbol}`;
  };

  return (
    <>
      <nav className="bg-gray-800 text-white py-4 px-6 fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="flex items-center justify-between lg:justify-start lg:space-x-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
            <span>CapGro</span>
          </Link>

          {/* SearchBar (visible on larger screens) */}
          <div className="hidden lg:block lg:flex-grow">
            <SearchBar onSelectStock={handleStockSelect} />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex lg:space-x-10">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 space-y-4 lg:hidden">
            <SearchBar onSelectStock={handleStockSelect} />
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Modals */}
      <Login isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <Register isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
};

export default Navbar;
