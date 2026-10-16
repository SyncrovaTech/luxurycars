//D:\D-Luxury-Car-Showroom\Backend\src\core\middleware\validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType<any>) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data.body;

    next();
  };
}