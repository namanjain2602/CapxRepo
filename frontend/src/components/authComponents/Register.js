import React, { useState, useEffect } from "react";

const Register = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Hardcoded user registration data
    const hardcodedUser = {
      name: "Naman",
      email: "naman@gmail.com",
      password: "Naman",
      mobile: "1234567890",
    };

    // Save hardcoded user to local storage (if not already saved)
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([hardcodedUser]));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email or mobile already exists
    const existingUser = users.find(
      (user) => user.email === formData.email || user.mobile === formData.mobile
    );
    if (existingUser) {
      setMessage("Email or Mobile number already registered!");
      return;
    }

    // Add new user to local storage
    const updatedUsers = [...users, formData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setMessage("User registered successfully!");
    setFormData({ name: "", email: "", password: "", mobile: "" }); // Clear form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
