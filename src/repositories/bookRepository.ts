import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";

/**
 * Contract for book storage.
 *
 * Services depend on this interface rather than a concrete class, so the
 * backing store can be swapped without touching business logic. Methods are
 * async even though the current implementation is synchronous, so a real
 * database can be introduced without changing any signatures.
 *
 * "Not found" is reported by return value, never by throwing — deciding
 * whether absence is an error belongs to the service layer.
 */
export interface IBookRepository {
  /** All books, optionally narrowed to a single genre. */
  findAll(genre?: string): Promise<Book[]>;

  /** A single book, or `undefined` if no book has that id. */
  findById(id: number): Promise<Book | undefined>;

  /** Stores a new book and returns it with its server-assigned id. */
  create(data: CreateBookRequest): Promise<Book>;

  /** The updated book, or `undefined` if the id did not exist. */
  update(id: number, data: UpdateBookRequest): Promise<Book | undefined>;

  /** `true` if a book was removed, `false` if the id did not exist. */
  delete(id: number): Promise<boolean>;
}