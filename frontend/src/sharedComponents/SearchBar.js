// components/SearchBar.js

import React, { useState, useEffect } from "react";
import { fetchStocks } from "../services/StockService";

const SearchBar = ({ onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case "ArrowDown":
        setActiveIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
        );
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          const selectedStock = searchResults[activeIndex];
          onSelectStock(selectedStock); // Trigger the parent action
        }
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search stocks"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setActiveIndex(-1); // Reset active index on input change
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
      />
      {searchResults.length > 0 ? (
        <ul className="absolute left-0 right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg max-h-60 overflow-auto z-10">
          {searchResults.map((stock, index) => (
            <li
              key={stock.symbol}
              className={`px-4 py-2 hover:bg-gray-300 cursor-pointer ${
                activeIndex === index ? "bg-gray-300" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onSelectStock(stock)} // Trigger the parent action
            >
              {stock.description} ({stock.symbol})
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
  );
};

export default SearchBar;
