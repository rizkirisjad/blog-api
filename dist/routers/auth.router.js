"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../middlewares/validation");
const verify_1 = require("../middlewares/verify");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", validation_1.validateRegister, this.authController.register);
        this.router.post("/login", this.authController.login);
        this.router.patch("/verify", verify_1.verifyTokenVerification, this.authController.verify);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
