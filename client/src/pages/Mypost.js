import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; // Importing toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify styles

// Sample data for demonstration without farmer ID
const initialPosts = [
    {
        cropImage: 'https://via.placeholder.com/150', // Replace with actual image URL
        cropName: 'Tomato',
        phoneNumber: '123-456-7890',
        price: 20,
        quantity: 100,
    },
    {
        cropImage: 'https://via.placeholder.com/150', // Replace with actual image URL
        cropName: 'Potato',
        phoneNumber: '987-654-3210',
        price: 15,
        quantity: 200,
    },
    // Add more posts as needed
];

const MyPost = () => {
    const [posts, setPosts] = useState(initialPosts);
    const [editIndex, setEditIndex] = useState(null); // Track the index of the post being edited

    const handleEdit = (index) => {
        setEditIndex(index); // Set the current index for editing
    };

    const handleSave = (index) => {
        // Save functionality is not needed as changes are made directly in the state
        setEditIndex(null); // Reset the edit index
        toast.success("Edit successful!"); // Show success message
    };

    const handleDelete = (index) => {
        const filteredPosts = posts.filter((_, i) => i !== index);
        setPosts(filteredPosts);
        toast.success("Post deleted!"); // Show delete confirmation
    };

    const handleFieldChange = (index, field, value) => {
        const updatedPosts = posts.map((post, i) => {
            if (i === index) {
                return {
                    ...post,
                    [field]: value,
                };
            }
            return post;
        });
        setPosts(updatedPosts); // Update state with new values
    };

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPosts = posts.map((post, i) => {
                    if (i === index) {
                        return {
                            ...post,
                            cropImage: reader.result, // Update the crop image
                        };
                    }
                    return post;
                });
                setPosts(updatedPosts);
                toast.success("Image updated!"); // Show success message
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    return (
        <div className="farmer-list" style={styles.list}>
            <ToastContainer /> {/* Toast container for notifications */}
            {posts.map((post, index) => (
                <div key={index} className="farmer-item" style={styles.item}>
                    <img src={post.cropImage} alt={post.cropName} className="crop-image" style={styles.image} />
                    <div className="farmer-details" style={styles.details}>
                        {editIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={post.cropName}
                                    onChange={(e) => handleFieldChange(index, 'cropName', e.target.value)}
                                    className="input-field"
                                    style={styles.input}
                                />
                                <p className="phone-number">Phone: 
                                    <input
                                        type="text"
                                        value={post.phoneNumber}
                                        onChange={(e) => handleFieldChange(index, 'phoneNumber', e.target.value)}
                                        className="input-field"
                                        style={styles.input}
                                    />
                                </p>
                                <p className="price">Price: $
                                    <input
                                        type="number"
                                        value={post.price}
                                        onChange={(e) => handleFieldChange(index, 'price', parseFloat(e.target.value))}
                                        className="input-field"
                                        style={styles.input}
                                    />
                                </p>
                                <p className="quantity">Quantity: 
                                    <input
                                        type="number"
                                        value={post.quantity}
                                        onChange={(e) => handleFieldChange(index, 'quantity', parseInt(e.target.value))}
                                        className="input-field"
                                        style={styles.input}
                                    />
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e)}
                                    className="image-input"
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="crop-name">{post.cropName}</h2>
                                <p className="phone-number">Phone: {post.phoneNumber}</p>
                                <p className="price">Price: ${post.price.toFixed(2)}</p>
                                <p className="quantity">Quantity: {post.quantity}</p>
                            </>
                        )}
                    </div>
                    <div className="action-buttons" style={styles.actions}>
                        {editIndex === index ? (
                            <button onClick={() => handleSave(index)} className="save-button">💾 Save</button>
                        ) : (
                            <button onClick={() => handleEdit(index)} className="edit-button">✏️ Edit</button>
                        )}
                        <button onClick={() => handleDelete(index)} className="delete-button">🗑️ Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Inline styles for alignment
const styles = {
    list: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center alignment
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff', // White background for items
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        width: '80%', // Width of the items
    },
    image: {
        width: '100px', // Fixed width for images
        height: '100px', // Fixed height for images
        marginRight: '1rem',
        borderRadius: '8px', // Rounded corners for images
    },
    details: {
        flex: '1',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column', // Vertical alignment of buttons
        alignItems: 'flex-end', // Right alignment
    },
    input: {
        margin: '0.5rem 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.5rem',
        width: '100%', // Full width for inputs
    },
};

export default MyPost;
