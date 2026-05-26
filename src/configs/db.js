import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
<<<<<<< HEAD
      process.env.MONGODB_AUTH +
        process.env.MONGODB_HOSTS +
        process.env.MONGODB_DB +
        process.env.MONGODB_OPTIONS,
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
=======
      "mongodb://phuocbao0709_db_user:juWV6sAQlYzQ1ufc@web95.vfgmsan.mongodb.net/",
    );
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659
    process.exit(1);
  }
};
