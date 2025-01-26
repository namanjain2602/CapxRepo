import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/UserService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const usernameOrEmailRegex =
      /^(?=.{3,50}$)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}|(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+)$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameOrEmailRegex.test(formData.usernameOrEmail)) {
      errors.usernameOrEmail = "Invalid email or username format.";
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await loginUser(formData);

      localStorage.setItem("logged", data.role);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("name", data.name);
      navigate(`/user-dashboard`);
      onClose();
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {errors.general && (
          <p className="text-red-500 mb-4">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Username or Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.usernameOrEmail && (
            <p className="text-red-500 text-sm mb-4">
              {errors.usernameOrEmail}
            </p>
          )}

          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
