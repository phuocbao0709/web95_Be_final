import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_AUTH +
        process.env.MONGODB_HOSTS +
        process.env.MONGODB_DB +
        process.env.MONGODB_OPTIONS,
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
