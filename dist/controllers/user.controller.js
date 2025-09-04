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
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                yield prisma_1.default.user.create({
                    data: {
                        username,
                        email,
                        password,
                    },
                });
                res.status(201).send("User created");
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany();
                res.status(200).send({
                    message: "Data users",
                    users,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma_1.default.user.findUnique({
                    where: {
                        id: +id,
                    },
                });
                res.status(200).send({
                    message: `User detail with id ${id}`,
                    user,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = res.locals.user;
                yield prisma_1.default.user.update({
                    where: {
                        id: +id,
                    },
                    data: req.body,
                });
                res.status(200).send({
                    message: `User with id ${id} has been updated`,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.delete({
                    where: {
                        id: +id,
                    },
                });
                res.status(200).send({
                    message: `User with id ${id} has been deleted`,
                });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getBlogUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const blogs = yield prisma_1.default.blog.findMany({
                    include: {
                        user: true,
                    },
                    where: {
                        userId: (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id,
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
}
exports.UserController = UserController;
