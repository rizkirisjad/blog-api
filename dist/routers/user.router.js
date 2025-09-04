"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const verify_1 = require("../middlewares/verify");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", verify_1.verifyToken, this.userController.getUsers);
        this.router.post("/", this.userController.createUser);
        this.router.patch("/", verify_1.verifyToken, this.userController.editUser);
        this.router.get("/blog", verify_1.verifyToken, this.userController.getBlogUser);
        this.router.get("/:id", this.userController.getUserId);
        this.router.delete("/:id", this.userController.deleteUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
