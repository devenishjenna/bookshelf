import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";
import { IBookRepository } from "./bookRepository";

export class InMemoryBookRepository implements IBookRepository {

  // defining some example books
  private books: Book[] = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 14.99 },
    { id: 2, title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", price: 19.99 },
    { id: 3, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", price: 18.50 },
    { id: 4, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 13.99 },
    { id: 5, title: "1984", author: "George Orwell", genre: "Fiction", price: 12.99 },
  ];

  // next id to assign
  private nextId = 3;

  async findAll(genre?: string): Promise<Book[]> {
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

  // returns newly created book
  async create(data: CreateBookRequest): Promise<Book> {
    const book: Book = {id: this.nextId++, ...data};
    this.books.push(book);

    return book;
  }

  // returns updated book or undefined
  async update(id: number, data: UpdateBookRequest): Promise<Book | undefined> {
    const index = this.books.findIndex((b) => (b.id === id));
    // id not found
    if (index === - 1) return undefined;

    // create updated book with original data, overwriting with new data
    const updated: Book = { ...this.books[index], ...data, id};
    this.books[index] = updated;

    return updated;
  }

  // returns true if deleted, false if not found
  async delete(id: number): Promise<boolean> {
    const index = this.books.findIndex((b) => b.id === id);
    // id not found
    if (index === -1) return false;
    // remove book 
    this.books.splice(index, 1);
    
    return true;
  }
}