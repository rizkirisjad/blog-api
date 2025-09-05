import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("username").notEmpty().withMessage("Username required"),
  body("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    // .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
    .notEmpty()
    .withMessage("Password required"),

  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.status(400).send({ errors: error.array() });
      return;
    }
    next();
  },
];

export const validateUpdateBlog = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("category")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters"),
  body("content")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.status(400).send({ errors: error.array() });
      return;
    }
    next();
  },
];
