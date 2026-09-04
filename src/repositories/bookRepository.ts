import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";

// defining book interface to be reused for different data storage systems
export interface IBookRepository {
  // all books, optionally narrowed to a single genre
  findAll(genre?: string): Promise<Book[]>;

  // a single book or `undefined` if no book has that id
  findById(id: number): Promise<Book | undefined>;

  // adds a new book and returns it with its server-assigned id
  create(data: CreateBookRequest): Promise<Book>;

  // the updated book or `undefined` if the id did not exist
  update(id: number, data: UpdateBookRequest): Promise<Book | undefined>;

  // `true` if a book was removed, `false` if the id did not exist
  delete(id: number): Promise<boolean>;
}