import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    objectives: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "suspended"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.methods.calculateProgress = async function () {
  const Step = mongoose.model("Step");
  const steps = await Step.find({ courseId: this._id });

  if (steps.length === 0) {
    this.progress = 0;
    this.status = "planned";
    return 0;
  }

  const completedSteps = steps.filter((step) => step.status === "completed");
  const progress = Math.round((completedSteps.length / steps.length) * 100);

  this.progress = progress;

  if (progress === 100) {
    this.status = "completed";
  } else if (progress > 0) {
    this.status = "in_progress";
  } else {
    this.status = "planned";
  }

  return progress;
};

export default mongoose.model("Course", courseSchema);
