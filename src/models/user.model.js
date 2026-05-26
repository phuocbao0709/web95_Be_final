import mongoose from "mongoose";

<<<<<<< HEAD
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    identity: { type: String },
    dob: { type: Date },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
=======
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        default: null
    }
});

const User = mongoose.model('User', userSchema);
export default User;
>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659
