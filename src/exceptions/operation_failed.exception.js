export class OperationFailedException extends Error {
  constructor(message) {
    super();
    this.message = `FS OPERATION FAILED: ${message}`;
  }
}
