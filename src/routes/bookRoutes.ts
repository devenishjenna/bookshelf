import { Router } from "express";
import { BookController } from "../controllers/bookController";
import { validateCreateBook, validateUpdateBook } from "../middleware/validateBook";

export function createBookRouter(controller: BookController): Router {
  const router = Router();

  // passing in references to controller functions
  router.get("/", controller.getAll);
  router.get('/discounted-price', controller.getDiscountedPrice)
  router.get("/:id", controller.getById);
  router.post("/", validateCreateBook, controller.create); // runs validation first
  router.put("/:id", validateUpdateBook, controller.update);
  router.delete("/:id", controller.delete);

  return router;
}