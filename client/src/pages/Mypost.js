import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const phoneno = localStorage.getItem("phoneNo");
        const response = await axios.post(
          "http://localhost:5000/api/crops/getSingleuser",
          { phoneno: phoneno }
        );
        console.log(response);

        if (Array.isArray(response.data.crop)) {
          setPosts(response.data.crop);
        } else {
          setPosts([]);
        }
      } catch (error) {
        alert("Failed to fetch crops.");
        setPosts([]);
      }
    };
    fetchCrops();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (index) => {
    const updatedCrop = posts[index];
    const cropId = posts[index]._id;
    const token = localStorage.getItem("token"); // Retrieve token

    try {
      const response = await axios.put(
        `http://localhost:5000/api/crops/update/${cropId}`,
        updatedCrop,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(response);
      if (response.status === 200) {
        // Handle success response
        setEditIndex(-1);
        alert("crop updated successfully");
      } else {
        // Handle failure response
        alert("Failed to update crop.");
      }
    } catch (error) {
      console.error("Error updating crop:", error);
      toast.error("Failed to update crop.");
    }
  };

  const handleDelete = async (index) => {
    const cropId = posts[index]._id;
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/crops/delete/${cropId}`
      );

      if (response.status === 200) {
        const newPosts = posts.filter((_, i) => i !== index);
        setPosts(newPosts);
        alert("crop deleted successfully");
      } else {
        alert("Failed to delete crop.");
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
      toast.error("Failed to delete crop.");
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedPosts = [...posts];
    updatedPosts[index][field] = value;
    setPosts(updatedPosts);
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg">
      <ToastContainer />
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={post._id}
            className="flex flex-col border border-gray-300 rounded-lg p-5 mb-5 bg-white shadow-md"
          >
            <img
              src={post.photo}
              alt={post.cropName}
              className="w-full h-auto rounded-lg mb-4"
            />
            <div className="flex-1 mb-4">
              {editIndex === index ? (
                <>
                  <div className="mb-4">
                    <label className="font-bold mb-2 block">Crop Name:</label>
                    <input
                      type="text"
                      value={post.cropName}
                      onChange={(e) =>
                        handleFieldChange(index, "cropName", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="font-bold mb-2 block">Price:</label>
                    <input
                      type="number"
                      value={post.price}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="font-bold mb-2 block">Quantity:</label>
                    <input
                      type="number"
                      value={post.quantity}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">
                    {post.cropName}
                  </h2>
                  <p className="text-gray-600">
                    Price: ${post.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Quantity: {post.quantity}</p>
                </>
              )}
            </div>
            <div className="flex justify-between">
              {editIndex === index ? (
                <button
                  onClick={() => handleSave(index)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  💾 Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No crops found.</p>
      )}
    </div>
  );
};

export default MyPost;
