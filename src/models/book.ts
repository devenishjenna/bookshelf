/** A book as it exists in the inventory. */
export interface Book {
  id: number
  title: string
  author: string
  genre: string
  price: number
}

/** Payload for creating a book. `id` is omitted because the server assigns it. */
export type CreateBookRequest = Omit<Book, "id">

/** Payload for updating a book. All fields optional; `id` can never be changed. */
export type UpdateBookRequest = Partial<CreateBookRequest>