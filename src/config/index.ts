import mongoose from "mongoose";
import User from "@models/User";
import bcrypt from "bcryptjs";

const CreateAdminUser = async () => {
  try {
    const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!user) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "",
        10
      );
      const newUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "ADMIN",
        activated: true,
        firstName: "Phoenix",
        lastName: "Creator",
        npi: process.env.NPI_NUMBER
      });

      await newUser.save();
      console.log("Admin User created successfully.");
    } else {
      console.log("Admin User already existed.");
    }
  } catch (err) {
    console.log(err);
  }
};

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL || "")
    .then(async () => {
      console.log("Connected to Mongo DB!!");
      CreateAdminUser();
    })
    .catch((err) => console.log(err));
};
