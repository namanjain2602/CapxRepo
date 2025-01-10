import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = ({ onClose }) => {
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("users")) || [];
    if (storedDetails.length > 0) {
      // Access the first user in the array
      setProfileDetails({
        name: storedDetails[0].name || "",
        email: storedDetails[0].email || "",
        mobile: storedDetails[0].mobile || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleSave = () => {
    // Save the updated profile details back to localStorage
    const storedDetails = JSON.parse(localStorage.getItem("users")) || [];
    if (storedDetails.length > 0) {
      storedDetails[0] = { ...storedDetails[0], ...profileDetails };
      localStorage.setItem("users", JSON.stringify(storedDetails));
    }
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileDetails.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.name || "N/A"}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileDetails.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.email || "N/A"}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Mobile</label>
            {isEditing ? (
              <input
                type="text"
                name="mobile"
                value={profileDetails.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <p>{profileDetails.mobile || "N/A"}</p>
            )}
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
