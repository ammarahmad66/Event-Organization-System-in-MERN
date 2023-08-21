import mongoose from "mongoose";

const biddingSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  vendor_id: {
    type: String,
    required: true,
  },
  acceptedPrice: { type: Number },
  VendorBid: { type: Number, required: true },
  UserBid: { type: Number, required: true },
  bidStatus: {
    type: String,
    enum: ["accepted", "rejected", "ongoing"],
    default: "ongoing",
    required: true,
  },
});

const Bid = mongoose.model("Bid", biddingSchema);
export default Bid;
