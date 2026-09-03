import { Request, Response } from "express";
import { BookService } from "../services/bookService";
import { ValidationError } from "../errors/appErrors";
import { CreateBookRequest, UpdateBookRequest } from "../models/book";

export class BookController {

  // automatically setting service as a property
  constructor(private readonly service: BookService) {}

  // setting all methods as async to allow for DB interactions
  // use arrow functions so that the instance is bound to the method
  // if any promise is rejected, flow automatically gets routed to errorHandler
  // order of Request type specification req.params, response body, req.body, req.query
  getAll = async (req: Request<{}, unknown, {}, { genre?: string }>, res: Response): Promise<void> => {
    const genre = req.query.genre as string | undefined; // only allows for 1 genre per request
    const books = await this.service.getAll(genre);
    res.status(200).json(books);
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const book = await this.service.getById(this.parseId(req.params.id));
    res.status(200).json(book);
  };
  // no type specified for req.params, response body (not necessary)
  create = async (req: Request<{}, unknown, CreateBookRequest>, res: Response): Promise<void> => {
    const book = await this.service.create(req.body);
    res.status(201).json(book);
  }

  // no type specified for response body (not necessary)
  update = async (req: Request<{ id: string }, unknown , UpdateBookRequest>, res: Response): Promise<void> => {
    const updated = await this.service.update(this.parseId(req.params.id), req.body)
    res.status(200).json(updated);
  }

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.service.delete(this.parseId(req.params.id));
    res.status(204).send();
  };

  // throw error for any id not positive integer
  private parseId(rawString: string): number {
    const id = Number(rawString)
    if (!Number.isInteger(id) || id < 1) {
      throw new ValidationError(`Invalid id: ${rawString}`);
    }
    return id;
  }
}