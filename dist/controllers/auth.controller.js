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
exports.AuthController = void 0;
const bcrypt_1 = require("bcrypt");
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const mailer_1 = require("../helpers/mailer");
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
                const user = yield prisma_1.default.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    },
                });
                const payload = { id: user.id };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY_VERIFY, {
                    expiresIn: "10m",
                });
                const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
                yield prisma_1.default.emailVerification.create({
                    data: {
                        userId: user.id,
                        token,
                        expiredAt,
                    },
                });
                const templatePath = path_1.default.join(__dirname, "../templates", "verify.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({
                    username: user.username,
                    email: user.email,
                    link: `http://localhost:3000/verify/${token}`,
                });
                yield mailer_1.transporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: user.email,
                    subject: "Verification Email",
                    html,
                });
                res.status(201).send("Register successfully");
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body;
                const user = yield prisma_1.default.user.findFirst({
                    where: {
                        OR: [
                            {
                                username: login,
                            },
                            {
                                email: login,
                            },
                        ],
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        password: true,
                        avatar: true,
                    },
                });
                if (!user)
                    throw { message: "User not found" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPass)
                    throw { message: "Invalid password" };
                const payload = {
                    id: user.id,
                    role: "user",
                };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY, {
                    expiresIn: "1d",
                });
                res.status(200).send({ message: "Login successfully", user, token });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id } = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user;
                const { token } = (_b = res.locals) === null || _b === void 0 ? void 0 : _b.token;
                const data = yield prisma_1.default.emailVerification.findFirst({
                    where: {
                        token,
                        userId: id,
                    },
                });
                if (!data)
                    throw { message: "Invalid link verification" };
                yield prisma_1.default.user.update({
                    data: {
                        isVerified: true,
                    },
                    where: {
                        id,
                    },
                });
                yield prisma_1.default.emailVerification.delete({
                    where: {
                        id: data.id,
                    },
                });
                res.status(200).send({ message: "Verification Successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.AuthController = AuthController;
