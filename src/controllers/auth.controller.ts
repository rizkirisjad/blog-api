import { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import prisma from "../prisma";
import { sign } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { transporter } from "../helpers/mailer";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      const payload = { id: user.id };
      const token = sign(payload, process.env.SECRET_KEY_VERIFY!, {
        expiresIn: "10m",
      });
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiredAt,
        },
      });

      const nextUrl = process.env.NEXT_URL || "http://localhost:3000";
      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        username: user.username,
        email: user.email,
        link: `${nextUrl}/verify/${token}`,
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: "Verification Email",
        html,
      });

      res.status(201).send("Register successfully");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      const user = await prisma.user.findFirst({
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

      if (!user) throw { message: "User not found" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Invalid password" };

      const payload = {
        id: user.id,
        role: "user",
      };
      const token = sign(payload, process.env.SECRET_KEY!, {
        expiresIn: "1d",
      });

      res.status(200).send({ message: "Login successfully", user, token });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { id } = res.locals?.user;
      const { token } = res.locals?.token;

      const data = await prisma.emailVerification.findFirst({
        where: {
          token,
          userId: id,
        },
      });

      if (!data) throw { message: "Invalid link verification" };

      await prisma.user.update({
        data: {
          isVerified: true,
        },
        where: {
          id,
        },
      });

      await prisma.emailVerification.delete({
        where: {
          id: data.id,
        },
      });

      res.status(200).send({ message: "Verification Successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
