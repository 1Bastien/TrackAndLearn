import courseService from "../services/courseService.js";

class CourseController {
  async createCourse(req, res) {
    try {
      const userId = req.user.id;
      const courseData = req.body;

      const course = await courseService.createCourse(userId, courseData);

      res.status(201).json({
        success: true,
        data: course,
        message: "Course created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCourses(req, res) {
    try {
      const userId = req.user.id;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        status: req.query.status,
        search: req.query.search,
      };

      const result = await courseService.getCourses(userId, options);

      const totalPages = Math.max(1, Math.ceil(result.total / options.limit));

      const response = {
        success: true,
        data: result.courses,
        currentPage: parseInt(options.page),
        totalPages: totalPages,
        totalItems: result.total,
        limit: parseInt(options.limit),
      };

      res.json(response);
    } catch (error) {
      console.error("Controller - Error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCourse(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const course = await courseService.getCourse(id, userId);

      res.json({
        success: true,
        data: course,
      });
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCourse(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const course = await courseService.updateCourse(id, userId, updateData);

      res.json({
        success: true,
        data: course,
        message: "Course updated successfully",
      });
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteCourse(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await courseService.deleteCourse(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStatistics(req, res) {
    try {
      const userId = req.user.id;

      const statistics = await courseService.getStatistics(userId);

      res.json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CourseController();
