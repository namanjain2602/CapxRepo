import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Profile from "../components/userComponents/Profile";
import { logoutUser } from "../services/UserService";
import SearchBar from "./SearchBar";


const UserNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [profileModal, setProfileModal] = useState(false);
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
      const accessToken = localStorage.getItem("token"); // Retrieve the token from localStorage

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
      <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10 shadow-md">
        {/* Logo */}
        <Link to="/user-dashboard" className="text-2xl font-bold flex items-center space-x-2">
          <span role="img" aria-label="logo">
            📊
          </span>
          <span>CapGro</span>
        </Link>

        <SearchBar onSelectStock={handleStockSelect} />

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          {/* My Stocks */}
          <Link to="/user-dashboard" className="text-gray-300 hover:text-blue-500 font-medium transition">

            <span>Home</span>
          </Link>
          <Link
            to="/user-dashboard/my-stocks"
            className="text-gray-300 hover:text-blue-500 font-medium transition"
          >
            Holdings
          </Link>

          {/* Profile Dropdown */}
          <div className="relative group">
            <span
              onClick={handleViewProfile}
              className="text-gray-300 cursor-pointer hover:text-gray-400 font-semibold transition"
            >
              Profile
            </span>
          </div>
          <span
            onClick={handleLogout}
            className="text-gray-300 cursor-pointer hover:text-red-700 font-medium transition"
          >
            Logout
          </span>
        </div>
      </nav>

      {/* Profile Modal */}
      {profileModal && <Profile onClose={() => setProfileModal(false)} />}
    </>
  );
};

export default UserNavbar;
