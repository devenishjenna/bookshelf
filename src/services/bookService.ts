import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";
import { IBookRepository } from "../repositories/bookRepository";
import { NotFoundError } from "../errors/appErrors";

/**
 * Business logic for the book inventory.
 *
 * Deliberately unaware of HTTP — no request, response, or status codes — so it
 * can be unit tested directly and reused outside the API. The repository is
 * injected as an interface, so tests can supply a fake implementation.
 *
 * This is the layer that turns a repository's `undefined` into an error:
 * storage reports what exists, the service decides that absence is a failure.
 */
export class BookService {

  constructor(private readonly repository: IBookRepository) {}

  /** All books, optionally narrowed to a single genre. */
  async getAll(genre?: string): Promise<Book[]> {
    return this.repository.findAll(genre);
  }

  /**
   * @returns The book with the given id.
   * @throws {NotFoundError} If no book has that id.
   */
  async getById(id: number): Promise<Book> {
    const book = await this.repository.findById(id);

    if (!book) {
      throw new NotFoundError(`Book with id ${id} not found.`)
    }

    return book;
  }

  /** Creates a book and returns it with its server-assigned id. */
  async create(data: CreateBookRequest): Promise<Book> {
    return this.repository.create(data);
  }

  /**
   * Applies a partial update, leaving unsupplied fields unchanged.
   *
   * @throws {NotFoundError} If no book has that id.
   */
  async update(id: number, data: UpdateBookRequest): Promise<Book> {
    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new NotFoundError(`Book with id ${id} not found`);
    }

    return updated;
  }

  /**
   * @throws {NotFoundError} If no book has that id.
   */
  async delete(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Book with id ${id} not found`);
    }
  }

}