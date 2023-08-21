import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken, isAdmin, isAuth } from "../utils.js";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import axios from "axios";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

/*
userRouter.get(
  '/favorites',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params._id);
      const events = await Event.find({ _id: { $in: user.favoriteEvents.event } });
      res.send(events)
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  })
);
*/

//api/events/:id

userRouter.get(
  "/:id/favorites",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const events = await Event.find({ _id: { $in: user.favoriteEvents } });
      //const events = await Event.find({ _id: { $in: user.favoriteEvents.event } });
      res.send(events);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  })
);

userRouter.post(
  "/:id/favorites",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const event = req.body.item;
      // console.log(user.favoriteEvents)
      if (user?.favoriteEvents?.length > 0) {
        const existingEvent = user.favoriteEvents.find((x) => x == event._id);
        if (existingEvent) {
          return res
            .status(400)
            .send("Event already exists in favorite events");
        }
      }
      user?.favoriteEvents?.push(event._id);
      await user?.save();
      res.send("Event added to favorite events successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  })
);

userRouter.put(
  "/:id/favorites",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const event = req.body.item;
      console.log("Testing", req);
      if (user?.favoriteEvents?.length > 0) {
        const existingEvent = user.favoriteEvents.find((x) => x == event._id);
        if (existingEvent) {
          user.favoriteEvents = user.favoriteEvents.filter(
            (x) => x !== event._id
          );
          await user.save();
          console.log("Event removed from favorite events successfully");
          res.send("Event removed from favorite events successfully");
        } else {
          return res.status(400).send("Event not found in favorite events");
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;
