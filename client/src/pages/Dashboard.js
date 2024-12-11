import React, { useState, useEffect } from "react";
import CropDetails from "./CropDetails";
import MyPost from "./Mypost";

const Dashboard = () => {
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleCreatePost = () => {
    setShowCropDetails(true);
    setShowMyPosts(false);
  };

  const handleShowMyPosts = () => {
    setShowMyPosts(true);
    setShowCropDetails(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login-farmer";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="bg-[#D8CFC4] w-64 p-6 shadow-lg fixed top-0 left-0 h-full z-10">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">Dashboard</h1>
        <ul>
          <li className="mb-4">
            <button
              onClick={handleCreatePost}
              className="w-full text-left py-2 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-300 transition duration-200"
            >
              Create Post
            </button>
          </li>
          <li>
            <button
              onClick={handleShowMyPosts}
              className="w-full text-left py-2 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-300 transition duration-200"
            >
              My Posts
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex-1 p-6 ml-64">
        {showCropDetails ? (
          <div>
            <CropDetails />
          </div>
        ) : showMyPosts ? (
          <MyPost />
        ) : (
          <h2 className="text-xl text-center text-gray-600">
            Select an option from the menu
          </h2>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
