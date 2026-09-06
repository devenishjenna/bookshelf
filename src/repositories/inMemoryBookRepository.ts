import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";
import { IBookRepository } from "./bookRepository";

// In-memory implementation of IBookRepository.
export class InMemoryBookRepository implements IBookRepository {

  // Seed data so the API returns something useful on a fresh start.
  private books: Book[] = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 14.99 },
    { id: 2, title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", price: 19.99 },
    { id: 3, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", price: 18.50 },
    { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 13.99 },
    { id: 5, title: "1984", author: "George Orwell", genre: "Fiction", price: 12.99 },
  ];

  // next id to assign
  private nextId = 6;

  async findAll(genre?: string): Promise<Book[]> {
    // Spread so callers get a copy — handing out the live array would let
    // them mutate the store from outside the class.
    if (!genre) return [...this.books];

    return this.books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  async findById(id: number): Promise<Book | undefined> {
    return this.books.find(
      (b) => (b.id === id)
    );
  }

  async create(data: CreateBookRequest): Promise<Book> {
    const book: Book = {...data, id: this.nextId++};
    this.books.push(book);

    return book;
  }

  async update(id: number, data: UpdateBookRequest): Promise<Book | undefined> {
    const index = this.books.findIndex((b) => (b.id === id));
    if (index === - 1) return undefined;

    // Later spreads win: supplied fields overwrite existing ones, untouched
    // fields survive, and `id` is applied last so it can never be changed.
    const updated: Book = { ...this.books[index], ...data, id};
    this.books[index] = updated;

    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) return false;

    this.books.splice(index, 1);
    
    return true;
  }
}