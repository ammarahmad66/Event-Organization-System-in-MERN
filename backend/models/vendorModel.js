import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlenght: 8,
    },
    CNIC: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "rejected",
    },
    businessName: { type: String, required: true, unique: true },
    bankName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },
    documentPath: { type: String },

    isVendor: { type: Boolean, default: true },
    event_id: [],
  },

  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
