import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  time: { type: Number, required: true },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
