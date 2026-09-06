import { Book, CreateBookRequest, UpdateBookRequest } from "../models/book";
import { IBookRepository } from "../repositories/bookRepository";
import { NotFoundError, ValidationError } from "../errors/appErrors";

export interface DiscountedPriceResult {
  genre: string;
  discount_percentage: number;
  total_discounted_price: number;
}

// business logic layer
// this layer does not know HTTP exists
// checks validity of request in business context
// depends on abstraction to allow for easy testing
export class BookService {

  constructor(private readonly repository: IBookRepository) {}

  // all books, optionally narrowed to a single genre
  async getAll(genre?: string): Promise<Book[]> {
    return this.repository.findAll(genre);
  }

  // a single book or throws if no book has that id
  async getById(id: number): Promise<Book> {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with id ${id} not found.`)
    }
    return book;
  }

  // creates a book and returns it with its server-assigned id
  async create(data: CreateBookRequest): Promise<Book> {
    return this.repository.create(data);
  }

  // updates book or throws if the id does not exist
  async update(id: number, data: UpdateBookRequest): Promise<Book> {
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Book with id ${id} not found`);
    }
    return updated;
  }

  // deletes book or throws if the id does not exist
  async delete(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Book with id ${id} not found`);
    }
  }

  // calculates discounted price of books in specific genre
  async calculateDiscountedPrice(genre: string, discountPercentage: number): Promise<DiscountedPriceResult> {
    if (discountPercentage < 0 || discountPercentage > 100) {
      // discount percentage not valid
      throw new ValidationError(`Discount must be between 0 and 100, got ${discountPercentage}`);
    }
    const books = await this.repository.findAll(genre);

    if (books.length === 0) {
      throw new NotFoundError(`No books found in genre "${genre}"`);
    }

    const totalPrice = books.reduce((sum, b) => sum + b.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);

    return {
      genre,
      discount_percentage: discountPercentage,
      total_discounted_price: Math.round(discountedPrice * 100) / 100,
    };
  }
}