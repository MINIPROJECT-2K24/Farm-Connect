import React, { useState, useEffect } from 'react';
import CropDetails from './CropDetails'; // Ensure you import CropDetails
import MyPost from './Mypost'; // Import the MyPost component

const Dashboard = () => {
    const [showCropDetails, setShowCropDetails] = useState(false); // State to manage CropDetails visibility
    const [showMyPosts, setShowMyPosts] = useState(false); // State to manage MyPosts visibility
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication status

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check for token in localStorage
        setIsAuthenticated(!!token); // Set authentication state based on token presence
    }, []);

    const handleCreatePost = () => {
        setShowCropDetails(true); // Show CropDetails when Create Post is clicked
        setShowMyPosts(false); // Ensure MyPosts is hidden
    };

    const handleShowMyPosts = () => {
        setShowMyPosts(true); // Show MyPosts when My Posts is clicked
        setShowCropDetails(false); // Ensure CropDetails is hidden
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        setIsAuthenticated(false); // Update authentication state
        window.location.href = '/login-farmer'; // Redirect to login page after logout
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Vertical Navbar with Pale Brown Background */}
            <nav className="bg-[#D8CFC4] w-64 p-6 shadow-lg">
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
                    {isAuthenticated && (
                        <li className="mt-4">
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 p-6">
                {/* Render CropDetails if showCropDetails is true */}
                {showCropDetails ? (
                    <div>
                        <CropDetails />
                    </div>
                ) : showMyPosts ? ( // Render MyPosts if showMyPosts is true
                    <MyPost />
                ) : (
                    <h2 className="text-xl text-center text-gray-600">Select an option from the menu</h2>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
