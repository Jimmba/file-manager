export class OperationFailedException extends Error {
  //! refactor?
  constructor(message) {
    super();
    this.message = `FS OPERATION FAILED: ${message}`;
  }
}
