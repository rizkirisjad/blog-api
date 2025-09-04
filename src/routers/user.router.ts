import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verify";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, this.userController.getUsers);
    this.router.post("/", this.userController.createUser);
    this.router.patch("/", verifyToken, this.userController.editUser);

    this.router.get("/blog", verifyToken, this.userController.getBlogUser);

    this.router.get("/:id", this.userController.getUserId);
    this.router.delete("/:id", this.userController.deleteUser);
  }
  getRouter(): Router {
    return this.router;
  }
}
