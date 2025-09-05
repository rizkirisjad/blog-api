import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { verifyToken } from "../middlewares/verify";
import { uploader } from "../helpers/uploader";
import { validateUpdateBlog } from "../middlewares/validation";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;

  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route("/")
      .post(
        uploader("diskStorage", "blog-").single("thumbnail"),
        verifyToken,
        this.blogController.createBlog
      )
      .get(this.blogController.getBlogs);

    this.router.post(
      "/cloud",
      uploader("memoryStorage", "blog-").single("thumbnail"),
      verifyToken,
      this.blogController.createBlogCloud
    );

    this.router.patch(
      "/cloud/:id",
      uploader("memoryStorage", "blog-").single("thumbnail"),
      verifyToken,
      validateUpdateBlog,
      this.blogController.updateBlogCloud
    );

    this.router
      .route("/:id")
      .get(this.blogController.getBlogId)
      .patch(
        uploader("diskStorage", "blog-").single("thumbnail"),
        verifyToken,
        validateUpdateBlog,
        this.blogController.updateBlog
      )
      .delete(verifyToken, this.blogController.deleteBlog);
  }

  getRouter(): Router {
    return this.router;
  }
}
