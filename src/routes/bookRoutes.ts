import { Router } from "express";
import { BookController } from "../controllers/bookController";

export function createBookRouter(controller: BookController): Router {
  const router = Router();

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.put("/", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}