// upload.js
import multer from "multer";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export the configured Multer instance
export default upload;
