import Step from "../models/Step.js";
import Course from "../models/Course.js";

class StepService {
  async createStep(userId, stepData) {
    try {
      const course = await Course.findOne({
        _id: stepData.courseId,
        userId,
      });

      if (!course) {
        throw new Error("Course not found or unauthorized access");
      }

      if (!stepData.order) {
        const lastOrder = await Step.findOne({
          courseId: stepData.courseId,
        })
          .sort({ order: -1 })
          .select("order");
        stepData.order = lastOrder ? lastOrder.order + 1 : 1;
      } else {
        await Step.updateMany(
          {
            courseId: stepData.courseId,
            order: { $gte: stepData.order },
          },
          { $inc: { order: 1 } }
        );
      }

      const step = new Step(stepData);
      const newStep = await step.save();

      return newStep;
    } catch (error) {
      throw new Error(`Error creating step: ${error.message}`);
    }
  }

  async getSteps(courseId, userId, options = {}) {
    try {
      const course = await Course.findOne({ _id: courseId, userId });
      if (!course) {
        throw new Error("Course not found or unauthorized access");
      }

      const { status, page = 1, limit = 12 } = options;
      const skip = (page - 1) * limit;

      let query = { courseId };

      if (status) {
        query.status = status;
      }

      const [steps, totalItems] = await Promise.all([
        Step.find(query).sort({ order: 1 }).skip(skip).limit(parseInt(limit)),
        Step.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        steps,
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        limit: parseInt(limit),
      };
    } catch (error) {
      throw new Error(`Error getting steps: ${error.message}`);
    }
  }

  async getStep(stepId, userId) {
    try {
      const step = await Step.findById(stepId);

      if (!step) {
        throw new Error("Step not found");
      }

      const course = await Course.findOne({
        _id: step.courseId,
        userId,
      });

      if (!course) {
        throw new Error("Unauthorized access to this step");
      }

      return step;
    } catch (error) {
      throw new Error(`Error getting step: ${error.message}`);
    }
  }

  async updateStep(stepId, userId, updateData) {
    try {
      const step = await Step.findById(stepId);

      if (!step) {
        throw new Error("Step not found");
      }

      const course = await Course.findOne({
        _id: step.courseId,
        userId,
      });

      if (!course) {
        throw new Error("Unauthorized access to this step");
      }

      const updatedStep = await Step.findByIdAndUpdate(stepId, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedStep;
    } catch (error) {
      throw new Error(`Error updating step: ${error.message}`);
    }
  }

  async deleteStep(stepId, userId) {
    try {
      const step = await Step.findById(stepId);

      if (!step) {
        throw new Error("Step not found");
      }

      const course = await Course.findOne({
        _id: step.courseId,
        userId,
      });

      if (!course) {
        throw new Error("Unauthorized access to this step");
      }

      await Step.findByIdAndDelete(stepId);

      return { message: "Step deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting step: ${error.message}`);
    }
  }

  async reorganizeSteps(courseId, userId, newOrder) {
    try {
      const course = await Course.findOne({ _id: courseId, userId });
      if (!course) {
        throw new Error("Course not found or unauthorized access");
      }

      const operations = newOrder.map((stepId, index) => ({
        updateOne: {
          filter: { _id: stepId, courseId },
          update: { order: index + 1 },
        },
      }));

      await Step.bulkWrite(operations);

      return await this.getSteps(courseId, userId);
    } catch (error) {
      throw new Error(`Error reorganizing steps: ${error.message}`);
    }
  }

  async markStepCompleted(stepId, userId) {
    try {
      const step = await Step.findById(stepId);
      if (!step) {
        throw new Error("Step not found");
      }

      const course = await Course.findOne({
        _id: step.courseId,
        userId,
      });

      if (!course) {
        throw new Error("Unauthorized access to this step");
      }

      const updatedStep = await Step.findByIdAndUpdate(
        stepId,
        { status: "completed" },
        { new: true, runValidators: true }
      );

      return updatedStep;
    } catch (error) {
      throw new Error(`Error marking step as completed: ${error.message}`);
    }
  }

  async getUpcomingDeadlines(userId, days = 7) {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const courses = await Course.find({ userId });
      const courseIds = courses.map((c) => c._id);

      const steps = await Step.find({
        courseId: { $in: courseIds },
        endDate: {
          $gte: new Date(),
          $lte: endDate,
        },
        status: { $ne: "completed" },
      })
        .populate("courseId", "title")
        .sort({ endDate: 1 });

      return steps;
    } catch (error) {
      throw new Error(`Error getting upcoming deadlines: ${error.message}`);
    }
  }
}

export default new StepService();
