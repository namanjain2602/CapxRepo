import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchStocks } from "../services/StockService";
import { toast } from "react-toastify";
import Profile from "../components/userComponents/Profile";
import { logoutUser } from "../services/UserService";


const UserNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [profileModal, setProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in first.");
      navigate("/"); // Redirect to the login page
      return;
    }

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




        {/* Search Bar */}
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
