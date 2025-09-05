"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../helpers/cloudinary");
class BlogController {
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!req.file)
                    throw { message: "Thumbnail is required" };
                const userId = (_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                const thumbnail = `http://localhost:8000/api/public/${req.file.filename}`;
                const { title, category, content } = req.body;
                yield prisma_1.default.blog.create({
                    data: {
                        title,
                        thumbnail,
                        category,
                        content,
                        userId,
                    },
                });
                res.status(201).send("Blog created");
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createBlogCloud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!req.file)
                    throw { message: "Thumbnail is required" };
                const userId = (_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                const cloud = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "blog");
                const thumbnail = cloud.secure_url;
                const { title, category, content } = req.body;
                yield prisma_1.default.blog.create({
                    data: {
                        title,
                        thumbnail,
                        category,
                        content,
                        userId,
                    },
                });
                res.status(201).send("Blog created");
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield prisma_1.default.blog.findMany({
                    include: {
                        user: true,
                    },
                });
                res.status(200).send({
                    message: "Data blogs",
                    blogs,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const blog = yield prisma_1.default.blog.findUnique({
                    where: {
                        id,
                    },
                    include: {
                        user: true,
                    },
                });
                res.status(200).send({
                    message: `Blog detail with id ${id}`,
                    blog,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // // 1. Cek hasil validasi dari express-validator
                // const errors = validationResult(req);
                // if (!errors.isEmpty()) {
                //   return res.status(400).send({ errors: errors.array() });
                // }
                const { id } = req.params;
                const { title, category, content } = req.body;
                // 2. Pastikan user login
                const userId = (_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    res.status(401).send({ message: "Unauthorized" });
                    return;
                }
                // 3. Cari blog
                const blog = yield prisma_1.default.blog.findUnique({ where: { id } });
                if (!blog) {
                    res.status(404).send({ message: "Blog not found" });
                    return;
                }
                // 4. Cek otorisasi → hanya author bisa update
                if (blog.userId !== userId) {
                    res.status(403).send({ message: "Forbidden" });
                    return;
                }
                // 5. Default pakai thumbnail lama
                let thumbnail = blog.thumbnail;
                // 6. Jika ada file baru → update thumbnail lokal
                if (req.file) {
                    thumbnail = `http://localhost:8000/api/public/${req.file.filename}`;
                }
                // 7. Update blog
                const updatedBlog = yield prisma_1.default.blog.update({
                    where: { id },
                    data: {
                        title,
                        category,
                        content,
                        thumbnail,
                    },
                });
                res.status(200).send({
                    message: "Blog updated",
                    blog: updatedBlog,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: "Internal server error" });
            }
        });
    }
    updateBlogCloud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const { title, category, content } = req.body;
                const userId = (_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    res.status(401).send({ message: "Unauthorized" });
                    return;
                }
                const blog = yield prisma_1.default.blog.findUnique({ where: { id } });
                if (!blog) {
                    res.status(404).send({ message: "Blog not found" });
                    return;
                }
                if (blog.userId !== userId) {
                    res.status(403).send({ message: "Forbidden" });
                    return;
                }
                let thumbnail = blog.thumbnail;
                if (req.file) {
                    const cloud = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "blog");
                    thumbnail = cloud.secure_url;
                }
                const updatedBlog = yield prisma_1.default.blog.update({
                    where: { id },
                    data: {
                        title,
                        category,
                        content,
                        thumbnail,
                    },
                });
                res.status(200).send({
                    message: "Blog updated",
                    blog: updatedBlog,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: "Internal server error" });
            }
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = req.params;
                const userId = (_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    res.status(401).send({ message: "Unauthorized" });
                    return;
                }
                const blog = yield prisma_1.default.blog.findUnique({ where: { id } });
                if (!blog) {
                    res.status(404).send({ message: "Blog not found" });
                    return;
                }
                if (blog.userId !== userId) {
                    res.status(403).send({ message: "Forbidden" });
                    return;
                }
                yield prisma_1.default.blog.delete({ where: { id } });
                res.status(200).send({ message: "Blog deleted" });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: "Internal server error" });
            }
        });
    }
}
exports.BlogController = BlogController;
