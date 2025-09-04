import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegister } from "../middlewares/validation";
import { verifyTokenVerification } from "../middlewares/verify";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      validateRegister,
      this.authController.register
    );
    this.router.post("/login", this.authController.login);

    this.router.patch(
      "/verify",
      verifyTokenVerification,
      this.authController.verify
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
