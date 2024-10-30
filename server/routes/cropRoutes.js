import express from "express";
import upload from "../middleware/upload.js"; // Multer middleware import
import {
  addCrop,
  deleteCrop,
  getAllcrops,
  getCropbyUser,
  updateCrop,
} from "../controllers/cropController.js";

const router = express.Router();

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
router.get("/getSingleuser", getCropbyUser);

//delete req
router.delete("/delete/:id", deleteCrop);

export default router;
