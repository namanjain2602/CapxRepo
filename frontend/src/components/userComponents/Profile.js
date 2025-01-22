import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchLoggedUser } from "../../services/UserService";
// Adjust path as needed

const Profile = ({ onClose }) => {
  const [profileDetails, setProfileDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("token"); // Assume token is stored in localStorage
    if (!accessToken) {
      toast.error("User is not logged in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await fetchLoggedUser(accessToken);
        setProfileDetails(data);
      } catch (error) {
        toast.error("Failed to fetch profile details.");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleSave = () => {
    toast.info("Save functionality not implemented yet.");
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={profileDetails.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.firstName || "N/A"}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={profileDetails.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.lastName || "N/A"}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <p>{profileDetails.username || "N/A"}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <p>{profileDetails.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Mobile</label>
            {isEditing ? (
              <input
                type="text"
                name="mobileNumber"
                value={profileDetails.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.mobileNumber || "N/A"}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Gender</label>
            <p>{profileDetails.gender || "N/A"}</p>
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Date of Birth</label>
            <p>{profileDetails.dateOfBirth || "N/A"}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
