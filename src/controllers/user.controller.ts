import { Request, Response } from "express";
import prisma from "../prisma";

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      await prisma.user.create({
        data: {
          username,
          email,
          password,
        },
      });
      res.status(201).send("User created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).send({
        message: "Data users",
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: +id,
        },
      });

      res.status(200).send({
        message: `User detail with id ${id}`,
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      await prisma.user.update({
        where: {
          id: +id,
        },
        data: req.body,
      });

      res.status(200).send({
        message: `User with id ${id} has been updated`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: {
          id: +id,
        },
      });

      res.status(200).send({
        message: `User with id ${id} has been deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getBlogUser(req: Request, res: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          user: true,
        },
        where: {
          userId: res.locals.user?.id,
        },
      });

      res.status(200).send({
        message: "Data blogs",
        blogs,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
