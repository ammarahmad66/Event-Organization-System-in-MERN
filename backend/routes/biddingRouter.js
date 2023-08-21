import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Bid from "../models/biddingModel.js";
import { isAuth } from "../utils.js";
import { io } from "../server.js";
const biddingRouter = express.Router();

// Get all bids
biddingRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const bids = await Bid.find({});
    res.send(bids);
  })
);

// Get bid by ID for vendor
// biddingRouter.get(
//   "/vendor/:id",
//   expressAsyncHandler(async (req, res) => {
//     const bid = await Bid.find({ vendor_id: req.params.id });
//     if (bid) {
//       res.send(bid);
//       console.log(bid);
//     } else {
//       res.status(404).send({ message: "Bid not found" });
//     }
//   })
// );

biddingRouter.get(
  "/vendor/:id",
  expressAsyncHandler(async (req, res) => {
    const bids = await Bid.find({ vendor_id: req.params.id })
      .populate({
        path: "event_id",
        select: "title price",
        model: "Event",
      })
      .populate({ path: "user_id", select: "name", model: "User" });
    if (bids) {
      res.send(bids);
    } else {
      res.status(404).send({ message: "Bids not found" });
    }
  })
);

//Get bid by both event id and client id
biddingRouter.get(
  "/:event_id/:user_id",

  expressAsyncHandler(async (req, res) => {
    try {
      const { event_id, user_id } = req.params;
      const bid = await Bid.findOne({ event_id, user_id });
      // console.log("testinnnnnnnnnnnnngggggggggggggggggg");
      if (bid) {
        res.send(bid);
      } else {
        res.send({ message: "Bid not found" });
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
);

// Create new bid
biddingRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const bid = new Bid({
      event_id: req.body.event_id,
      user_id: req.body.user_id,
      vendor_id: req.body.vendor_id,
      VendorBid: req.body.VendorBid,
      UserBid: req.body.UserBid,
      bidStatus: req.body.bidStatus,
      acceptedPrice: 0,
    });
    const createdBid = await bid.save();
    res.status(201).send({ message: "Bid created", bid: createdBid });
  })
);

// Update bid
biddingRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    console.log(`Bid update request received for bid ID ${req.params.id}`);
    const bid = await Bid.findById(req.params.id);
    if (bid) {
      bid.VendorBid = req.body.VendorBid || bid.VendorBid;
      bid.UserBid = req.body.UserBid || bid.UserBid;
      bid.bidStatus = req.body.bidStatus || bid.bidStatus;
      bid.acceptedPrice = req.body.acceptedPrice || 0;
      const updatedBid = await bid.save();
      res.send({ message: "Bid updated", bid: updatedBid });

      // Emit the updated bid
      console.log(`Emitting updated bid: ${JSON.stringify(updatedBid)}`);
      io.to(req.params.id).emit("updateBid", updatedBid);
    } else {
      res.status(404).send({ message: "Bid not found" });
    }
  })
);

// Delete bid
biddingRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const bid = await Bid.findById(req.params.id);
    if (bid) {
      const deletedBid = await bid.remove();
      res.send({ message: "Bid deleted", bid: deletedBid });
    } else {
      res.status(404).send({ message: "Bid not found" });
    }
  })
);

export default biddingRouter;
