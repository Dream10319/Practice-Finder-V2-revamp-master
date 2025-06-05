import mongoose from "mongoose";
import User from "./User";

const AuthProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  uid: {
    type: String
  },
  provider: {
    type: String,
    enum: ["Google"]
  }
});

const AuthProvider = mongoose.model("authproviders", AuthProviderSchema);

export default AuthProvider;