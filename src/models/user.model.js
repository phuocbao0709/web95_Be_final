import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    identity: { type: String },
    dob: { type: Date },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
    },
    password: { type: String },
    apiKey: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
