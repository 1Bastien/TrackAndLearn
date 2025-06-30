import Course from "../models/Course.js";
import Step from "../models/Step.js";

class CourseService {
  async createCourse(userId, courseData) {
    try {
      const { status, progress, ...cleanCourseData } = courseData;

      const course = new Course({
        ...cleanCourseData,
        userId,
        status: "planned",
        progress: 0,
      });

      return await course.save();
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  async getCourses(userId, options = {}) {
    try {
      const { page = 1, limit = 10, status, search } = options;
      const skip = (page - 1) * limit;

      let query = { userId };

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Course.countDocuments(query);

      const courses = await Course.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "firstName lastName email");

      return {
        courses,
        total,
      };
    } catch (error) {
      throw new Error(`Error getting courses: ${error.message}`);
    }
  }

  async getCourse(courseId, userId) {
    try {
      const course = await Course.findOne({
        _id: courseId,
        userId,
      }).populate("userId", "firstName lastName email");

      if (!course) {
        throw new Error("Course not found");
      }

      return course;
    } catch (error) {
      throw new Error(`Error getting course: ${error.message}`);
    }
  }

  async updateCourse(courseId, userId, updateData) {
    try {
      const { status, progress, ...allowedUpdates } = updateData;

      const allowedFields = [
        "title",
        "description",
        "objectives",
        "startDate",
        "endDate",
      ];
      const updateFields = Object.keys(allowedUpdates);

      const isValidOperation = updateFields.every((field) =>
        allowedFields.includes(field)
      );
      if (!isValidOperation) {
        throw new Error(
          "Invalid updates! Only title, description, objectives, startDate, and endDate can be modified."
        );
      }

      const course = await Course.findOneAndUpdate(
        { _id: courseId, userId },
        allowedUpdates,
        { new: true, runValidators: true }
      );

      if (!course) {
        throw new Error("Course not found");
      }

      return course;
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  async deleteCourse(courseId, userId) {
    try {
      const course = await Course.findOne({ _id: courseId, userId });

      if (!course) {
        throw new Error("Course not found");
      }

      await Step.deleteMany({ courseId: courseId });
      await Course.findByIdAndDelete(courseId);

      return { message: "Course and steps deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }

  async getStatistics(userId) {
    try {
      const [courses, completedCount, inProgressCount] = await Promise.all([
        Course.find({ userId }),
        Course.countDocuments({ userId, status: "completed" }),
        Course.countDocuments({ userId, status: "in_progress" }),
      ]);

      const totalCourses = courses.length;
      const totalProgress = courses.reduce(
        (sum, course) => sum + course.progress,
        0
      );
      const averageProgress =
        totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

      return {
        courses: {
          total: totalCourses,
          completed: completedCount,
          inProgress: inProgressCount,
          planned: totalCourses - completedCount - inProgressCount,
        },
        averageProgress: averageProgress,
      };
    } catch (error) {
      throw new Error(`Error getting user statistics: ${error.message}`);
    }
  }

  async getProgressHistory(userId, days = 30) {
    try {
      const courses = await Course.find({ userId }).select(
        "title _id startDate createdAt"
      );

      const coursesWithSteps = await Promise.all(
        courses.map(async (course) => {
          const allSteps = await Step.find({ courseId: course._id }).select(
            "completedDate _id"
          );

          return {
            _id: course._id,
            title: course.title,
            startDate: course.startDate || course.createdAt,
            steps: allSteps.map((step) => ({
              _id: step._id,
              completedDate: step.completedDate,
            })),
          };
        })
      );

      return coursesWithSteps;
    } catch (error) {
      throw new Error(`Error getting progress history: ${error.message}`);
    }
  }
}

export default new CourseService();
