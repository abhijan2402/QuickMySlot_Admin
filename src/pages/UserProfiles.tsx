import React, { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Edit } from "lucide-react";

export default function UserProfiles() {
  const userInitial = {
    fullName: "John Doe",
    username: "johndoe123",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    address: "1234 Elm Street, Springfield, IL, 62704",
    joinedDate: "January 15, 2023",
    role: "Customer",
    status: "Active",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    recentActivities: [
      "Logged in from new device",
      "Updated profile picture",
      "Changed password",
      "Placed an order",
    ],
  };

  const [user, setUser] = useState(userInitial);

  // Modal visibility & mode state ('password' or 'profilePic')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("password"); // 'password' or 'profilePic'

  // Password form state & errors
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Profile picture file state & preview
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  // Handle input change for password modal
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and submit new password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    let tempErrors = { newPassword: "", confirmPassword: "" };

    if (passwordData.newPassword.length < 8) {
      tempErrors.newPassword = "Password must be at least 8 characters.";
      valid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    // Submit password changes here (e.g., API)

    console.log("New password submitted:", passwordData.newPassword);

    // Close modal and reset
    setIsModalOpen(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setErrors({ newPassword: "", confirmPassword: "" });
  };

  // Handle file input change for profile pic
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  // Submit new profile picture
  const handleProfilePicSubmit = (e) => {
    e.preventDefault();
    if (!newProfilePic) return;

    // Normally, upload to server and get URL
    // Here, we use previewPic as new profile picture URL for demo
    setUser((prev) => ({ ...prev, profilePicture: previewPic }));

    // Reset modal state
    setIsModalOpen(false);
    setNewProfilePic(null);
    setPreviewPic(null);
  };

  // Open modal with mode and reset modal-specific states
  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
    // Reset modal content states
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setErrors({ newPassword: "", confirmPassword: "" });
    setNewProfilePic(null);
    setPreviewPic(null);
  };

  // Close modal and reset preview URL if any
  const closeModal = () => {
    setIsModalOpen(false);
    if (previewPic) {
      URL.revokeObjectURL(previewPic);
      setPreviewPic(null);
      setNewProfilePic(null);
    }
    setErrors({ newPassword: "", confirmPassword: "" });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="User Profile" />

      <div className="max-w-6xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Profile Details
          </h3>
          {/* Edit button for profile pic */}
          <button
            onClick={() => openModal("profilePic")}
            className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-[#EE4E34] transition-colors text-sm"
          >
            <Edit />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Profile Picture and Basic Info */}
          <div className="flex flex-col items-center border border-gray-200 rounded-2xl p-5 dark:border-gray-700 lg:w-1/3">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="mb-4 h-32 w-32 rounded-full object-cover shadow-md"
            />
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            <p
              className={`mt-2 rounded-full px-3 py-1 text-sm font-semibold ${
                user.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {user.status}
            </p>
          </div>

          {/* Right: Detailed Info */}
          <div className="flex-1 space-y-8">
            {/* Personal Info */}
            <section>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Full Name
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Role
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Member since
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.joinedDate}
                  </p>
                </div>
              </div>
            </section>

            {/* Forgot Password Button */}
            <button
              onClick={() => openModal("password")}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-[#EE4E34] transition-colors text-sm"
            >
              Forgot Password
            </button>

            {/* Contact Details */}
            {/* <section>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Contact Details
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Phone Number
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.phone}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Address
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.address}
                  </p>
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {modalMode === "password" && (
              <>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Set New Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] ${
                        errors.newPassword
                          ? "border-red-600"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7C0902] ${
                        errors.confirmPassword
                          ? "border-red-600"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded bg-blue-500 text-white font-semibold hover:bg-[#EE4E34] transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalMode === "profilePic" && (
              <>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Change Profile Picture
                </h3>
                <form onSubmit={handleProfilePicSubmit} className="space-y-4">
                  <div>
                    {previewPic ? (
                      <img
                        src={previewPic}
                        alt="Preview"
                        className="mb-4 h-32 w-32 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <img
                        src={user.profilePicture}
                        alt="Current Profile"
                        className="mb-4 h-32 w-32 rounded-full object-cover shadow-md"
                      />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border rounded-sm px-4 py-2 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newProfilePic}
                      className={`py-2 px-4 rounded ${
                        newProfilePic
                          ? "bg-blue-500 text-white hover:bg-[#EE4E34]"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      } font-semibold transition`}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
