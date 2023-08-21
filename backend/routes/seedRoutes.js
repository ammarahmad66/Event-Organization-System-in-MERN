import express from "express";
import data from "../data.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Event.remove({});
  const createdEvents = await Event.insertMany(data.events);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdEvents, createdUsers });
});

export default seedRouter;
