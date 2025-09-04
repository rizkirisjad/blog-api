import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { verifyToken } from "../middlewares/verify";
import { uploader } from "../helpers/uploader";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      uploader("diskStorage", "blog-").single("thumbnail"),
      verifyToken,
      this.blogController.createBlog
    );
    this.router.get("/", this.blogController.getBlogs);

    this.router.post(
      "/cloud",
      uploader("memoryStorage", "blog-").single("thumbnail"),
      verifyToken,
      this.blogController.createBlogCloud
    );

    this.router.get("/:id", this.blogController.getBlogId);
  }

  getRouter(): Router {
    return this.router;
  }
}
