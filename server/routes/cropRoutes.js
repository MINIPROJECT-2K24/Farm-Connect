import express from "express";
import upload from "../middleware/upload.js"; // Multer middleware import
import { addCrop, getAllcrops } from "../controllers/cropController.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("photo"), // Expecting a single file under the field name 'ph
  addCrop // Your addCrop function
);

router.get("/getcrops/:cropName", getAllcrops);

export default router;
