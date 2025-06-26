import stepService from "../services/stepService.js";

class StepController {
  async createStep(req, res) {
    try {
      const userId = req.user.id;
      const stepData = req.body;

      const step = await stepService.createStep(userId, stepData);

      res.status(201).json({
        success: true,
        data: step,
        message: "Step created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getSteps(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
        status: req.query.status,
      };

      const result = await stepService.getSteps(courseId, userId, options);

      res.json({
        success: true,
        data: result.steps,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalItems,
          limit: result.limit,
        },
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 500;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStep(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const step = await stepService.getStep(id, userId);

      res.json({
        success: true,
        data: step,
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 500;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStep(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const step = await stepService.updateStep(id, userId, updateData);

      res.json({
        success: true,
        data: step,
        message: "Step updated successfully",
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteStep(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await stepService.deleteStep(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 500;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async reorganizeSteps(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const { newOrder } = req.body;

      if (!Array.isArray(newOrder)) {
        return res.status(400).json({
          success: false,
          message: "The new order must be an array of step IDs",
        });
      }

      const steps = await stepService.reorganizeSteps(
        courseId,
        userId,
        newOrder
      );

      res.json({
        success: true,
        data: steps,
        message: "Steps reorganized successfully",
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async markStepCompleted(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const step = await stepService.markStepCompleted(id, userId);

      res.json({
        success: true,
        data: step,
        message: "Step marked as completed",
      });
    } catch (error) {
      const status =
        error.message.includes("not found") ||
        error.message.includes("unauthorized")
          ? 404
          : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUpcomingDeadlines(req, res) {
    try {
      const userId = req.user.id;
      const days = req.query.days || 7;

      const steps = await stepService.getUpcomingDeadlines(
        userId,
        parseInt(days)
      );

      res.json({
        success: true,
        data: steps,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new StepController();
