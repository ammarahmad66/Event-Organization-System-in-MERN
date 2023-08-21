import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";
import Message from "../models/messageModel.js";
const messageRouter = express.Router();
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
messageRouter.get("/", async (req, res) => {
  const msg = await Message.find();
  res.send(msg);
});

messageRouter.post(
  "/send",

  expressAsyncHandler(async (req, res) => {
    console.log("this is working", req.body);
    const allMsg = await Message.find();
    const newMsg = new Message({
      message: req.body.message,
      sender: req.body.sender,
      receiver: req.body.receiver,
      time: allMsg.length + 1,
    });

    const msg = await newMsg.save();
    res.send({ message: "Message Sent", msg });
  })
);

// messageRouter.get(
//   "/:id1/:id2",
//   expressAsyncHandler(async (req, res) => {
//     const msg = await Message.find({
//       $or: [
//         { sender: req.params.id1, receiver: req.params.id2 },
//         { sender: req.params.id2, receiver: req.params.id1 },
//       ],
//     });
//     msg.sort((a, b) => a.time - b.time);
//     res.send(msg);
//   })
// );

messageRouter.get(
  "/:id1/:id2",
  expressAsyncHandler(async (req, res) => {
    const msg = await Message.find({
      $or: [
        { sender: req.params.id1, receiver: req.params.id2 },
        { sender: req.params.id2, receiver: req.params.id1 },
      ],
    })
      .populate({ path: "sender", select: "name", model: "User" })
      .populate({ path: "receiver", select: "name", model: "Vendor" })
      .sort({ time: 1 });
    res.send(msg);
  })
);

messageRouter.get(
  "/v/:id1",
  expressAsyncHandler(async (req, res) => {
    console.log("Hitting this api");
    const allmsg = await Message.find({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }],
    });
    res.send(allmsg);
  })
);

// messageRouter.get(
//   "/vendor/:id1/t",
//   expressAsyncHandler(async (req, res) => {
//     const allmsg = await Message.find({
//       $or: [{ sender: req.params.id1 }, { receiver: req.params.id1 }],
//     });
//     const messageList = [];
//     for (const msg of allmsg) {
//       if (msg.sender === req.params.id1) {
//         msg.sender = "You";
//         messageList.push({ msg: msg.message, status: "vendor" });
//       } else {
//         msg.sender = "Customer";
//       }
//     }
//     // this api is yet to be made for the vendor side message platform data retrieval based on Users
//     const allUsers = await User.find();
//   })
// );

messageRouter.get("/vendor/:id/t", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find all distinct senders with whom the user has had conversations
    const distinctSenders = await Message.distinct("sender", {
      receiver: userId,
    });

    // Find all distinct receivers who have sent messages to the user
    const distinctReceivers = await Message.distinct("receiver", {
      sender: userId,
    });

    // Combine the two lists and make them unique
    const distinctClients = [
      ...new Set([...distinctSenders, ...distinctReceivers]),
    ];

    // For each distinct client, retrieve all messages sent or received by the user
    const conversations = [];
    for (let i = 0; i < distinctClients.length; i++) {
      const client = distinctClients[i];

      // Find all messages where the user is the sender and the client is the receiver
      const sentMessages = await Message.find({
        sender: userId,
        receiver: client,
      }).sort({ time: 1 });

      // Find all messages where the user is the receiver and the client is the sender
      const receivedMessages = await Message.find({
        sender: client,
        receiver: userId,
      }).sort({ time: 1 });

      const currentClient = await User.findOne({ _id: client });

      const messages = [];

      // Add isSender attribute to each message object
      sentMessages.forEach((message) => {
        messages.push({ ...message._doc, isUser: 1 });
      });
      receivedMessages.forEach((message) => {
        messages.push({ ...message._doc, isUser: 0 });
      });
      messages.sort((a, b) => a.time - b.time);
      conversations.push({
        client,
        name: currentClient.name,
        messages,
      });
    }

    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default messageRouter;
