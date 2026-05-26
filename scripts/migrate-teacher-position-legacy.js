import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/configs/db.js";
import TeacherPosition from "../src/models/teacherPosition.model.js";

dotenv.config();

const isDryRun = process.argv.includes("--dry-run");

const countPositions = async (filter) => TeacherPosition.countDocuments(filter);

const run = async () => {
  await connectDB();

  try {
    const legacyFilter = { isDeleted: true };

    const [beforeActive, beforeDeleted, legacyCount] = await Promise.all([
      countPositions({ isDeleted: false }),
      countPositions({ isDeleted: true }),
      countPositions(legacyFilter),
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
      const updateResult = await TeacherPosition.updateMany(legacyFilter, {
        $set: { isDeleted: false },
      });
      modifiedCount = updateResult.modifiedCount ?? 0;
    }

    const [afterActive, afterDeleted, afterLegacy] = await Promise.all([
      countPositions({ isDeleted: false }),
      countPositions({ isDeleted: true }),
      countPositions(legacyFilter),
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
  console.error("Teacher position legacy migration failed:", error);
  process.exit(1);
});
