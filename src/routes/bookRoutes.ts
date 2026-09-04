import { Router } from "express";
import { BookController } from "../controllers/bookController";

export function createBookRouter(controller: BookController): Router {
  const router = Router();

  // passing in references to controller functions
  router.get("/", controller.getAll);
  router.get('/discounted-price', controller.getDiscountedPrice)
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}