import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/auth";


export const registerUser = async (formData, tempRole = "user") => {
  try {
    const response = await fetch(`${API_BASE_URL}/register?tempRole=${tempRole}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed. Please try again.");
    }

    return response;
  } catch (error) {
    throw new Error(error.message || "An error occurred. Please try again later.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed.");
    }

    const data = await response.json();
    return data; // Return the response data to the caller
  } catch (err) {
    throw new Error("Invalid Credentials!");
  }
};


export const logoutUser = async (accessToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/logout`, // Replace with your logout API endpoint
      {}, // If the API requires a body, provide it here
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in logout API:", error.message);
    throw error;
  }
};

export const fetchLoggedUser = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loggedUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass the token in headers
      },
    });
    return response.data; // The RegisterDto object
  } catch (error) {
    console.error("Error fetching logged user:", error);
    throw error;
  }
};
