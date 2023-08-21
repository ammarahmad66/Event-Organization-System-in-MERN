import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import seedRouter from "./routes/seedRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";
import path from "path";
import { fileURLToPath } from "url"; // Add this line
import { dirname } from "path"; // Add this line
import biddingRouter from "./routes/biddingRouter.js";
import logger from "morgan";
const __filename = fileURLToPath(import.meta.url); // Add this line
const __dirname = dirname(__filename); // A

dotenv.config();
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export { io };
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("bidUpdate", (bidId) => {
    console.log(`User ${socket.id} joined bid room ${bidId}`);
    socket.join(bidId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Replace this with the origin of your frontend
    credentials: true,
  })
);
//app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.use("/api/seed", seedRouter);
app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", messageRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/bid", biddingRouter);
app.get("/api/keys/paypal", (req, res) => {
  res.send("sb");
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
