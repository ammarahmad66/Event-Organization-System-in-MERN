import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import { isAdmin, isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.orderItems);
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
      bookingDate: req.body.bookingDate,
      vendorId: req.body.vendorId,
      clientId: req.body.clientId,
      specialArrangements: req.body.specialArrangements,
      arrangementsPrice: req.body.arrangementsPrice,
      bookingTime: req.body.time,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const eventCategories = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, eventCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Booking Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Event Successfully Happened" });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

// mark event as done for vendor
orderRouter.put(
  "/:id/markAsDone/vendor",
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Event Successfully Happened" });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.send({ message: "Booking Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Booking Not Found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Booking Deleted" });
    } else {
      res.status(404).send({ message: "Booking Not Found" });
    }
  })
);

orderRouter.delete(
  "/:id/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (order.createdAt < twentyFourHoursAgo) {
        res.send({ message: "Booking cannot be deleted after 24 hours" });
        return;
      }
      await order.remove();
      res.send({ message: "Booking Deleted Succesfully" });
    } else {
      res.status(404).send({ message: "Eventing Not Found" });
    }
  })
);

orderRouter.get("/vendor/:id", async (req, res) => {
  const vendorId = req.params.id;
  const orders = await Order.find({ vendorId: vendorId });
  if (orders) {
    res.send(orders);
  } else {
    res.status(404).send({ message: "No orders found for this vendor" });
  }
});

export default orderRouter;
