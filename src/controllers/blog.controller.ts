import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

export class BlogController {
  async createBlog(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Thumbnail is required" };

      const userId = res.locals?.user?.id;
      const thumbnail = `http://localhost:8000/api/public/${req.file.filename}`;
      const { title, category, content } = req.body;
      await prisma.blog.create({
        data: {
          title,
          thumbnail,
          category,
          content,
          userId,
        },
      });
      res.status(201).send("Blog created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createBlogCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Thumbnail is required" };

      const userId = res.locals?.user?.id;
      const cloud = await cloudinaryUpload(req.file, "blog");
      const thumbnail = cloud.secure_url;
      const { title, category, content } = req.body;

      await prisma.blog.create({
        data: {
          title,
          thumbnail,
          category,
          content,
          userId,
        },
      });
      res.status(201).send("Blog created");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          user: true,
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

  async getBlogId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blog = await prisma.blog.findUnique({
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
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
