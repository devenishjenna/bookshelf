export interface Book {
  id: number
  title: string
  author: string
  genre: string
  price: number
}

// id is omitted since server assigns it
export type CreateBookRequest = Omit<Book, "id">

export type UpdateBookRequest = Partial<CreateBookRequest>