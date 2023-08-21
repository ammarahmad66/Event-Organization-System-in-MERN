import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    slugs: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    numberOfReviews: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    specialArrangements: {},
    opening: {
      type: String,
      required: true,
    },
    closing: {
      type: String,
      required: true,
    },
    bookings: [
      {
        date: { type: String },
        time: [String],
      },
    ],
    specialArrangements: [],
    suspended: {
      type: Boolean,
      default: false,
      required: true,
    },
    location: {
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
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the location field
eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

export default Event;
