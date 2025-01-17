import React from "react";

const Error = ({ message }) => {
  return (
    <div className="flex items-center justify-center bg-red-100 border border-red-400 text-red-600 rounded-md p-4 shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 5.636a9 9 0 11-12.728 0m6.364 6.364v2m0 4h.01"
        />
      </svg>
      <p className="text-sm md:text-base font-semibold">{message}</p>
    </div>
  );
};

export default Error;
