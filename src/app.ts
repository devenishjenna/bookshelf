import express from "express";
import { InMemoryBookRepository } from "./repositories/inMemoryBookRepository";
import { BookService } from "./services/bookService";
import { BookController } from "./controllers/bookController";
import { createBookRouter } from "./routes/bookRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// creating new express app
const app = express();

// for every request, parse body to json and attach to req.body
app.use(express.json());

// composition root
const repository = new InMemoryBookRepository();
const service = new BookService(repository);
const controller = new BookController(service);

// only handle requests starting with /books
app.use("/books", createBookRouter(controller));

// end of normal flow (no errors thrown)
app.use(notFoundHandler);
// end of error flow (takes 4 parameters so only gets called when error thrown)
app.use(errorHandler);

export default app;