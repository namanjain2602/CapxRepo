import React from "react";

const Loader = ({ message }) => {
  const displayText = message || "Loading...";
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      {/* Gradient Spinning Circle */}
      <div className="relative w-20 h-20 border-4 border-t-transparent border-t-blue-500 border-l-cyan-500 border-r-green-500 rounded-full animate-spin"></div>
      {/* Loading Message */}
      <p className="text-lg font-semibold text-blue-600 text-center">
        {displayText}
      </p>
    </div>
  );
};

export default Loader;
