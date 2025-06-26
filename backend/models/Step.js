import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
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
    externalLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "The external link must be a valid URL",
      },
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },
    order: {
      type: Number,
      default: 1,
    },
    estimatedDuration: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

stepSchema.index({ courseId: 1, order: 1 });

stepSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "completed" && !this.completedDate) {
      this.completedDate = new Date();
    } else if (this.status !== "completed") {
      this.completedDate = undefined;
    }
  }
  next();
});

async function updateCourseProgress(courseId) {
  const Course = mongoose.model("Course");
  const course = await Course.findById(courseId);
  if (course) {
    await course.calculateProgress();
    await course.save();
  }
}

stepSchema.post("save", async function () {
  await updateCourseProgress(this.courseId);
});

stepSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateCourseProgress(doc.courseId);
  }
});

stepSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await updateCourseProgress(this.courseId);
  }
);

stepSchema.post("deleteMany", async function (result) {
  if (this._conditions.courseId) {
    await updateCourseProgress(this._conditions.courseId);
  }
});

export default mongoose.model("Step", stepSchema);
