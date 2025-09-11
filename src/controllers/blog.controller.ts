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
      const id = req.params.id; // atau Number(req.params.id) kalau pakai Int

      const blog = await prisma.blog.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      if (!blog) {
        res.status(404).send({ message: `Blog with id ${id} not found` });
        return;
      }

      res.status(200).send({
        message: `Blog detail with id ${id}`,
        blog,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      // // 1. Cek hasil validasi dari express-validator
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).send({ errors: errors.array() });
      // }

      const { id } = req.params;
      const { title, category, content } = req.body;

      // 2. Pastikan user login
      const userId = res.locals?.user?.id;
      if (!userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      // 3. Cari blog
      const blog = await prisma.blog.findUnique({ where: { id } });
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
      const updatedBlog = await prisma.blog.update({
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
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  async updateBlogCloud(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, category, content } = req.body;

      const userId = res.locals?.user?.id;
      if (!userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const blog = await prisma.blog.findUnique({ where: { id } });
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
        const cloud = await cloudinaryUpload(req.file, "blog");
        thumbnail = cloud.secure_url;
      }

      const updatedBlog = await prisma.blog.update({
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
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userId = res.locals?.user?.id;
      if (!userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const blog = await prisma.blog.findUnique({ where: { id } });
      if (!blog) {
        res.status(404).send({ message: "Blog not found" });
        return;
      }

      if (blog.userId !== userId) {
        res.status(403).send({ message: "Forbidden" });
        return;
      }

      await prisma.blog.delete({ where: { id } });

      res.status(200).send({ message: "Blog deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
}
