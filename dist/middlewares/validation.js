"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateBlog = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username required"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        // .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
        .notEmpty()
        .withMessage("Password required"),
    (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            res.status(400).send({ errors: error.array() });
            return;
        }
        next();
    },
];
exports.validateUpdateBlog = [
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters"),
    (0, express_validator_1.body)("category")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Category must be at least 3 characters"),
    (0, express_validator_1.body)("content")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters"),
    (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            res.status(400).send({ errors: error.array() });
            return;
        }
        next();
    },
];
