// a book as it exists in the inventory
export interface Book {
  id: number
  title: string
  author: string
  genre: string
  price: number
}

// payload for creating a book. `id` is omitted because the server assigns it
// using type to allow for Omit
export type CreateBookRequest = Omit<Book, "id">

// payload for updating a book. All fields optional, `id` can never be changed
export type UpdateBookRequest = Partial<CreateBookRequest>