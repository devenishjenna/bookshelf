# Bookshelf

A RESTful API for managing a bookstore's inventory, built with Express and TypeScript using an n-layered architecture.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
git clone https://github.com/devenishjenna/bookshelf.git
cd bookshelf
npm install
```

## Running the API

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

The server listens on the port set in the `PORT` environment variable. If `PORT` is not set, server listens on `http://localhost:3000`.

## Running tests

```bash
npm test
```

Runs the Vitest suite once and exits. `npm run test:watch` re-runs tests on file changes.

## Data

Books are stored in memory and seeded with 5 books across three genres (Fantasy, Science Fiction, Fiction) on startup. Data does not persist between restarts.

## API Reference

### `GET /books`

Returns all books. Supports an optional `genre` query parameter (case-insensitive).

```
GET /books?genre=Fiction
```

```json
[
  { "id": 4, "title": "To Kill a Mockingbird", "author": "Harper Lee", "genre": "Fiction", "price": 13.99 },
  { "id": 5, "title": "1984", "author": "George Orwell", "genre": "Fiction", "price": 12.99 }
]
```

### `GET /books/:id`

Returns a single book, or `404` if the id doesn't exist.

```
GET /books/1
```

```json
{ "id": 1, "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "price": 140 }
```

### `POST /books`

Creates a book. `title`, `author`, `genre` (non-empty strings) and `price` (positive number) are required; `id` is assigned by the server and rejected if supplied. Returns `201`.

```
POST /books
Content-Type: application/json

{ "title": "Neuromancer", "author": "William Gibson", "genre": "Science Fiction", "price": 16.99 }
```

```json
{ "id": 6, "title": "Neuromancer", "author": "William Gibson", "genre": "Science Fiction", "price": 170 }
```

### `PUT /books/:id`

Updates a book. All fields are optional — only supplied fields are changed. `id` cannot be changed. Returns `404` if the id doesn't exist.

```
PUT /books/1
Content-Type: application/json

{ "price": 90 }
```

```json
{ "id": 1, "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "price": 90 }
```

### `DELETE /books/:id`

Deletes a book. Returns `204` with no body, or `404` if the id doesn't exist.

```
DELETE /books/1
```

### `GET /books/discounted-price`

Calculates the total discounted price for all books in a genre.

```
GET /books/discounted-price?genre=Fiction&discount=10
```

```json
{ "genre": "Fiction", "discount_percentage": 10, "total_discounted_price": 24.28 }
```

Returns `400` if `genre` is missing, `discount` is missing/not a number, or `discount` is outside 0–100. Returns `404` if no books match the genre.

### Error format

All errors share one shape:

```json
{ "error": "NotFoundError", "message": "Book with id 99 not found." }
```

## Architecture

The codebase is split into layers, each depending only on the one below it:

```
server → app → routes → controllers → services → repositories → models
```

- **Repositories** are accessed only through an interface (`IBookRepository`), never a concrete class. The service layer depends on that interface, not on the in-memory implementation — so the storage layer can be swapped (e.g. for a database) without changing any business logic, and tests can inject a fake repository instead of a real one.
- **Services** contain all business logic (CRUD orchestration, the discount calculation) and have no knowledge of HTTP — no request, response, or status codes. This keeps them independently - good for testing.
- **Controllers** translate between HTTP and the service layer: parsing/validating input, choosing status codes, and shaping responses.
- Input validation runs as Express middleware, ahead of the controller, so invalid requests never reach business logic. input validation is run on create and update functions.
- Errors are thrown as typed classes (`NotFoundError`, `ValidationError`) and translated into HTTP responses by a single error-handling middleware, keeping status-code decisions out of the service and controller layers.
- All errors that are not thrown deliberately get routed to `errorHandler`.

## Testing

Unit tests (Vitest) cover `BookService.calculateDiscountedPrice`: the standard calculation, an invalid discount, a genre with no matching books, and the 0%/100% boundary values.

## Known limitations

- Data is in-memory only. The repository interface is designed so a persistent store (e.g. SQLite) can be substituted without touching the service or controller layers.
- Unit tests cover the discount calculation only. CRUD operations are covered by manual testing rather than automated tests.
