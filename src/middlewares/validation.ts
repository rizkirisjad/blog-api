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
