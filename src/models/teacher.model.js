import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema({
  type: { type: String },
  school: { type: String },
  major: { type: String },
  year: { type: Number },
  isGraduated: { type: Boolean, default: false },
});

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    code: { type: String, required: true, unique: true },
    startDate: { type: Date },
    endDate: { type: Date },
    teacherPositionsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherPosition",
      },
    ],
    degrees: [degreeSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Teacher", teacherSchema);
