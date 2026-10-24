//D:\D-Luxury-Car-Showroom\Backend\src\modules\showrooms\controllers\showroom.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ShowroomService } from "../services/showroom.service.js";

export class ShowroomController {
  static async getPublicShowrooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 12);

      if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(limit) ||
        limit < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid pagination values",
        });
        return;
      }

      const result =
        await ShowroomService.getPublicShowrooms({
          city:
            typeof req.query.city === "string"
              ? req.query.city
              : undefined,

          search:
            typeof req.query.search === "string"
              ? req.query.search
              : undefined,

          page,
          limit,
        });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicShowroomBySlug(
    req: Request<{slug : string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const showroom =
        await ShowroomService.getPublicShowroomBySlug(
          req.params.slug
        );

      if (!showroom) {
        res.status(404).json({
          success: false,
          message: "Showroom not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        showroom,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getManagementShowrooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const rawStatus = req.query.isActive;

      let isActive: boolean | undefined;

      if (rawStatus === "true") {
        isActive = true;
      } else if (rawStatus === "false") {
        isActive = false;
      }

      const result =
        await ShowroomService.getManagementShowrooms({
          search:
            typeof req.query.search === "string"
              ? req.query.search
              : undefined,

          page: Number(req.query.page ?? 1),
          limit: Number(req.query.limit ?? 20),
          isActive,
        });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getManagementShowroomById(
    req: Request<{id : string}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const showroom =
        await ShowroomService.getManagementShowroomById(
          req.params.id
        );

      if (!showroom) {
        res.status(404).json({
          success: false,
          message: "Showroom not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        showroom,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createShowroom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const showroom =
        await ShowroomService.createShowroom(req.body);

      res.status(201).json({
        success: true,
        message: "Showroom created successfully",
        showroom,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateShowroom(
    req: Request<{id : string}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const showroom =
        await ShowroomService.updateShowroom(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Showroom updated successfully",
        showroom,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateShowroomStatus(
    req: Request<{id : string}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (typeof req.body.isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
        return;
      }

      const showroom =
        await ShowroomService.updateShowroomStatus(
          req.params.id,
          req.body.isActive
        );

      res.status(200).json({
        success: true,
        message: "Showroom status updated successfully",
        showroom,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShowroom(
    req: Request<{id : string}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await ShowroomService.deleteShowroom(req.params.id);

      res.status(200).json({
        success: true,
        message: "Showroom deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}