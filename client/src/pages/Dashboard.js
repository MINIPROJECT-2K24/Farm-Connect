import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import CropDetails from "./CropDetails";
import MyPost from "./Mypost";

const Dashboard = () => {
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleCreatePost = () => {
    setShowCropDetails(true);
    setShowMyPosts(false);
    setIsMobileMenuOpen(false); // Close the menu on mobile
  };

  const handleShowMyPosts = () => {
    setShowMyPosts(true);
    setShowCropDetails(false);
    setIsMobileMenuOpen(false); // Close the menu on mobile
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#1B1B1B]">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed bottom-2 left-4 bg-[#61f75b] p-3 rounded-full shadow-lg z-50 md:hidden"
      >
        <FaBars className="text-white w-6 h-6" />
      </button>

      {/* Sidebar */}
      <nav
        className={`bg-[#1B1B1B] w-64 p-6 shadow-lg fixed top-14 left-0 h-full z-10 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
       
        <ul>
          <li className="mb-4">
            <button
              onClick={handleCreatePost}
              className="w-full text-left py-2 px-4 rounded-lg bg-[#1B1B1B] text-[#d1ff48] hover:bg-[#eef8ce] hover:text-[#1B1B1B] transition duration-200"
            >
              Create Post
            </button>
          </li>
          <li>
            <button
              onClick={handleShowMyPosts}
              className="w-full text-left py-2 px-4 rounded-lg bg-[#1B1B1B] text-[#d1ff48] hover:bg-[#eef8ce] hover:text-[#1B1B1B] transition duration-200"
            >
              My Posts
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 mt-0">
        {showCropDetails ? (
          <div className="mt-8">
            <CropDetails />
          </div>
        ) : showMyPosts ? (
          <MyPost />
        ) : (
          <h2 className="text-xl text-center text-[#eef8ce]">
            Select an option from the menu
          </h2>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
