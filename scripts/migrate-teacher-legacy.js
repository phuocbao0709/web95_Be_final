import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/configs/db.js";
import Teacher from "../src/models/teacher.model.js";
import User from "../src/models/user.model.js";

dotenv.config();

const isDryRun = process.argv.includes("--dry-run");

const countTeachers = async (filter) => Teacher.countDocuments(filter);

const run = async () => {
  await connectDB();

  try {
    const activeUsers = await User.find({ isDeleted: false }, { _id: 1 }).lean();
    const activeUserIds = activeUsers.map((user) => user._id);

    const legacyFilter = {
      userId: { $in: activeUserIds },
      isDeleted: true,
    };

    const [beforeActive, beforeDeleted, legacyCount] = await Promise.all([
      countTeachers({ isDeleted: false }),
      countTeachers({ isDeleted: true }),
      countTeachers(legacyFilter),
    ]);

    console.log(
      JSON.stringify(
        {
          mode: isDryRun ? "dry-run" : "apply",
          before: {
            active: beforeActive,
            deleted: beforeDeleted,
            legacyCandidates: legacyCount,
          },
        },
        null,
        2,
      ),
    );

    let modifiedCount = 0;

    if (!isDryRun && legacyCount > 0) {
      const updateResult = await Teacher.updateMany(legacyFilter, {
        $set: { isDeleted: false },
      });
      modifiedCount = updateResult.modifiedCount ?? 0;
    }

    const [afterActive, afterDeleted, afterLegacy] = await Promise.all([
      countTeachers({ isDeleted: false }),
      countTeachers({ isDeleted: true }),
      countTeachers(legacyFilter),
    ]);

    console.log(
      JSON.stringify(
        {
          modifiedCount,
          after: {
            active: afterActive,
            deleted: afterDeleted,
            legacyCandidates: afterLegacy,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error("Teacher legacy migration failed:", error);
  process.exit(1);
});
