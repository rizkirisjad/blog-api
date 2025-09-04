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
}
exports.BlogController = BlogController;
