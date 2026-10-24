//D:\D-Luxury-Car-Showroom\Backend\src\core\utils\app-error.ts
export class AppError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number
  ) {
    super(message);

    this.statusCode = statusCode;

    Object.setPrototypeOf(
      this,
      AppError.prototype
    );
  }
}