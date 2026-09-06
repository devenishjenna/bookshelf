import { describe, it, expect, beforeEach } from "vitest";
import { BookService } from "../src/services/bookService";
import { IBookRepository } from "../src/repositories/bookRepository";
import { Book, CreateBookRequest, UpdateBookRequest } from "../src/models/book";
import { ValidationError, NotFoundError } from "../src/errors/appErrors";

// built for testing ONLY
export class TestBookRepository implements IBookRepository {

  private books: Book[] = [
      { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 50},
      { id: 2, title: "1984", author: "George Orwell", genre: "Fiction", price: 75},
  ];

  async findAll(genre?: string): Promise<Book[]> {
    if (!genre) return [...this.books];

    return this.books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  async findById(id: number): Promise<Book | undefined> {
    throw new Error("not needed - just satisfying interface");
  }

  async create(data: CreateBookRequest): Promise<Book> {
    throw new Error("not needed - just satisfying interface");
  }

  async update(id: number, data: UpdateBookRequest): Promise<Book | undefined> {
    throw new Error("not needed - just satisfying interface");
  }

  async delete(id: number): Promise<boolean> {
    throw new Error("not needed - just satisfying interface");
  }
}

describe("BookService.calculateDiscountedPrice", () => {
  
  let service: BookService;

  // setting up service before each test is run
  beforeEach(() => {
    const repository = new TestBookRepository();
    service = new BookService(repository);
  })

  // valid discount calc test
  it("calculates the total discounted price for a category",
    async () => {
      const result = await service.calculateDiscountedPrice("Fiction", 10)
      expect(result.total_discounted_price).toBe(112.50)
    }
  )

  it("throws ValidationError when discount is out of range",
    async () => {
      // can't use await here because then an error will be thrown
      const result = service.calculateDiscountedPrice("Fiction", 110)
      await expect(result).rejects.toThrow(ValidationError)
    }
  )

  it("throws NotFoundError when no books match the genre",
    async () => {
      // can't use await here because then an error will be thrown
      const result = service.calculateDiscountedPrice("Thriller", 10)
      await expect(result).rejects.toThrow(NotFoundError)
    }
  )

  it("edge case, 0% discount",
    async () => {
      const result = await service.calculateDiscountedPrice("Fiction", 0)
      expect(result.total_discounted_price).toBe(125)
    }
  )

  it("edge case, 100% discount",
    async () => {
      const result = await service.calculateDiscountedPrice("Fiction", 100)
      expect(result.total_discounted_price).toBe(0)
    }
  )

})