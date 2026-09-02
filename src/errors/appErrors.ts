/**
 * Base class for errors thrown deliberately, as opposed to unexpected crashes.
 *
 * The error-handling middleware reads `statusCode` to decide the HTTP response,
 * which keeps status-code decisions out of the service and controller layers.
 */
export class AppError extends Error {

  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    // Without this, every subclass would report its name as "Error".
    this.name = this.constructor.name
  }
}

/** A requested resource does not exist. Maps to HTTP 404. */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404)
  }
}

/** The client sent invalid or malformed input. Maps to HTTP 400. */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}