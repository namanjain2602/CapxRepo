import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Profile from "../components/userComponents/Profile";
import { logoutUser } from "../services/UserService";
import SearchBar from "./SearchBar";

const UserNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [profileModal, setProfileModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  const handleStockSelect = (stock) => {
    window.location.href = `/stock/${stock.symbol}`;
  };

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in first.");
      navigate("/");
      return;
    }
  }, []);

  const handleLogout = async () => {
    if (!isLoggedIn) {
      toast.error("You are already logged out. Please log in first.");
      navigate("/");
      return;
    }

    try {
      const accessToken = localStorage.getItem("token");

      // Call the logout API
      await logoutUser(accessToken);

      // Remove token and update state
      localStorage.removeItem("logged");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      toast.success("You have successfully logged out.");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleViewProfile = () => {
    setProfileModal(true);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white py-4 px-6 fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="flex items-center justify-between lg:justify-start lg:space-x-8">
          {/* Logo */}
          <Link to="/user-dashboard" className="text-2xl font-bold flex items-center space-x-2">
          <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
            <span>CapGro</span>
          </Link>

          {/* SearchBar (hidden on smaller screens) */}
          <div className="hidden lg:block lg:flex-grow ">
            <SearchBar onSelectStock={handleStockSelect} />
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

          {/* Navigation Links (hidden on smaller screens) */}
          <div className="hidden lg:flex lg:space-x-6 items-center">
            <Link to="/user-dashboard" className="text-gray-300 hover:text-blue-500 font-medium transition">
              Home
            </Link>
            <Link
              to="/user-dashboard/my-stocks"
              className="text-gray-300 hover:text-blue-500 font-medium transition"
            >
              Holdings
            </Link>
            <span
              onClick={handleViewProfile}
              className="text-gray-300 cursor-pointer hover:text-gray-400 font-semibold transition"
            >
              Profile
            </span>
            <span
              onClick={handleLogout}
              className="text-gray-300 cursor-pointer hover:text-red-700 font-medium transition"
            >
              Logout
            </span>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 space-y-4 lg:hidden">
            <SearchBar onSelectStock={handleStockSelect} />
            <Link to="/user-dashboard" className="block text-gray-300 hover:text-blue-500 font-medium transition">
              Home
            </Link>
            <Link
              to="/user-dashboard/my-stocks"
              className="block text-gray-300 hover:text-blue-500 font-medium transition"
            >
              Holdings
            </Link>
            <span
              onClick={handleViewProfile}
              className="block text-gray-300 cursor-pointer hover:text-gray-400 font-semibold transition"
            >
              Profile
            </span>
            <span
              onClick={handleLogout}
              className="block text-gray-300 cursor-pointer hover:text-red-700 font-medium transition"
            >
              Logout
            </span>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      {profileModal && <Profile onClose={() => setProfileModal(false)} />}
    </>
  );
};

export default UserNavbar;
