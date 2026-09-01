import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";

export interface IBookRepository {
  // using Promise so that store can be replaced by DB down the line. 
  // returns all books - taking in optional genre
  findAll(genre?: string): Promise<Book[]>;

  // returns book by id - returning undefined if book doesn't exist
  findById(id: number): Promise<Book | undefined>;

  // returns newly created book
  create(data: CreateBookRequest): Promise<Book>;

  // returns updated book or undefined
  update(id: number, data: UpdateBookRequest): Promise<Book | undefined>;

  // returns true if deleted, false if not found
  delete(id: number): Promise<boolean>;
}