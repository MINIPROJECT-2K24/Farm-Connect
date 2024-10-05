import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    farmerName: {
      type: String,
      required: true,
    },
    location: {
      City: { type: String, required: true },
      State: { type: String, required: true },
      District: { type: String, required: true },
      PostalCode: { type: String, required: true },
    },
    geopoint: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    photo: { type: String, required: true },
    phoneno: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

cropSchema.index({ geopoint: "2dsphere" });
const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
