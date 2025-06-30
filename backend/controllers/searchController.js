import Course from "../models/Course.js";
import Step from "../models/Step.js";

class SearchController {
  async globalSearch(req, res) {
    try {
      const userId = req.user.id;
      const { q: query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.json({
          success: true,
          data: [],
          message: "Query too short",
        });
      }

      const searchRegex = new RegExp(query.trim(), "i");

      const courses = await Course.find({
        userId,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { objectives: searchRegex },
        ],
      }).select("title description status progress");

      const steps = await Step.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { notes: searchRegex },
        ],
      })
        .populate({
          path: "courseId",
          match: { userId },
          select: "title",
        })
        .select("title description status courseId");

      const filteredSteps = steps.filter((step) => step.courseId);

      const results = [
        ...courses.map((course) => ({
          type: "course",
          _id: course._id,
          title: course.title,
          description: course.description,
          status: course.status,
          progress: course.progress,
        })),
        ...filteredSteps.map((step) => ({
          type: "step",
          _id: step._id,
          title: step.title,
          description: step.description,
          status: step.status,
          courseId: step.courseId._id,
          courseTitle: step.courseId.title,
        })),
      ];

      res.json({
        success: true,
        data: results,
        total: results.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SearchController();
