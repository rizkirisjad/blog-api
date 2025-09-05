"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const verify_1 = require("../middlewares/verify");
const uploader_1 = require("../helpers/uploader");
const validation_1 = require("../middlewares/validation");
class BlogRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.blogController = new blog_controller_1.BlogController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .route("/")
            .post((0, uploader_1.uploader)("diskStorage", "blog-").single("thumbnail"), verify_1.verifyToken, this.blogController.createBlog)
            .get(this.blogController.getBlogs);
        this.router.post("/cloud", (0, uploader_1.uploader)("memoryStorage", "blog-").single("thumbnail"), verify_1.verifyToken, this.blogController.createBlogCloud);
        this.router.patch("/cloud/:id", (0, uploader_1.uploader)("memoryStorage", "blog-").single("thumbnail"), verify_1.verifyToken, validation_1.validateUpdateBlog, this.blogController.updateBlogCloud);
        this.router
            .route("/:id")
            .get(this.blogController.getBlogId)
            .patch((0, uploader_1.uploader)("diskStorage", "blog-").single("thumbnail"), verify_1.verifyToken, validation_1.validateUpdateBlog, this.blogController.updateBlog)
            .delete(verify_1.verifyToken, this.blogController.deleteBlog);
    }
    getRouter() {
        return this.router;
    }
}
exports.BlogRouter = BlogRouter;
