import { Request, Response } from "express";
import { BookService } from "../services/bookService";
import { ValidationError } from "../errors/appErrors";
import { UpdateBookRequest } from "../models/book";

export class BookController {

  constructor(private readonly service: BookService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const genre = req.query.genre as string | undefined;
    const books = await this.service.getAll(genre);
    res.status(200).json(books);
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const book = await this.service.getById(this.parseId(req.params.id));
    res.status(200).json(book)
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const book = await this.service.create(req.body);
    res.status(201).json(book)
  }

  update = async (req: Request<{ id: string }, unknown , UpdateBookRequest>, res: Response): Promise<void> => {
    const updated = await this.service.update(this.parseId(req.params.id), req.body)
    res.status(200).json(updated)
  }

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.service.delete(this.parseId(req.params.id));
    res.status(204).send()
  };

  // throw error for anything not positive integer
  private parseId(rawString: string): number {
    const id = Number(rawString)
    if (!Number.isInteger(id) || id < 1) {
      throw new ValidationError(`Invalid id: ${rawString}`);
    }
    return id;
  }
}