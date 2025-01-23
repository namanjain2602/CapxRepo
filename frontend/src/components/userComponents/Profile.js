import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { fetchLoggedUser } from "../../services/UserService"; // Adjust path as needed

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
  const hasFetched = useRef(false);

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
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProfile();
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 transform transition-all hover:scale-105 max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          <p className="text-sm text-gray-600">Manage your profile details</p>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileDetails.firstName?.[0] || "U")}+${encodeURIComponent(profileDetails.lastName || "User")}&background=random`}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-full border-4 border-blue-400 shadow-lg"
            />
          </div>


          {/* First Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={profileDetails.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
              />
            ) : (
              <p className="text-lg text-gray-700">{profileDetails.firstName || "N/A"}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={profileDetails.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
              />
            ) : (
              <p className="text-lg text-gray-700">{profileDetails.lastName || "N/A"}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Username</label>
            <p className="text-lg text-gray-700">{profileDetails.username || "N/A"}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <p className="text-lg text-gray-700">{profileDetails.email || "N/A"}</p>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Mobile</label>
            {isEditing ? (
              <input
                type="text"
                name="mobileNumber"
                value={profileDetails.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
              />
            ) : (
              <p className="text-lg text-gray-700">{profileDetails.mobileNumber || "N/A"}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Gender</label>
            <p className="text-lg text-gray-700">{profileDetails.gender || "N/A"}</p>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Date of Birth</label>
            <p className="text-lg text-gray-700">{profileDetails.dateOfBirth || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all w-full sm:w-auto mb-4"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all w-full sm:w-auto mb-4"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all w-full sm:w-auto mb-4"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
