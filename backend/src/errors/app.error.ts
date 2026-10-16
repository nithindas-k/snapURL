/**
 * Application-level error class.
 * Lives in its own module so any layer (service, controller, middleware)
 * can import it without creating cross-layer circular dependencies.
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
