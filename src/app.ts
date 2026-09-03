import express from "express";
import { InMemoryBookRepository } from "./repositories/inMemoryBookRepository";
import { BookService } from "./services/bookService";
import { BookController } from "./controllers/bookController";
import { createBookRouter } from "./routes/bookRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// creating new express app
const app = express();

// for every request, set json body to req.body
app.use(express.json());

const repository = new InMemoryBookRepository();
const service = new BookService(repository);
const controller = new BookController(service);

app.use("/books", createBookRouter(controller));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;