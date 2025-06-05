import mongoose from "mongoose";
import Practice from "./Practice";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  npi: {
    type: String,
  },
  phone: {
    type: String,
  },
  specialty: {
    type: String,
  },
  needFinancing: {
    type: Boolean,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Practice,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
