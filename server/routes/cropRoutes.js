import express from "express";
import multer from 'multer';
import path from 'path'
import upload from "../middleware/upload.js"; // Multer middleware import
import {
  addCrop,
  deleteCrop,
  getAllcrops,
  getCropbyUser,
  updateCrop,
} from "../controllers/cropController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Rename the multer instance to `imageUpload`
const imageUpload = multer({ storage });

// API endpoint to handle file upload
router.post('/api/crops/uploadImage', imageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Post request for adding crop (already working)
router.post("/add", imageUpload.single("photo"), addCrop); // Use imageUpload for file handling


//post req
router.post(
  "/add",
  upload.single("photo"), // Expecting a single file under the field name 'ph
  addCrop // Your addCrop function
);

//put req
router.put("/update/:id", updateCrop);

//get req
router.get("/getcrops", getAllcrops);
router.post("/getSingleuser",getCropbyUser);

//delete req
router.delete("/delete/:id", deleteCrop);

export default router;