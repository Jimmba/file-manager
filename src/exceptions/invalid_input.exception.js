export class InvalidInputException extends Error {
  //! refactor?
  constructor(message) {
    super();
    this.message = `INVALID INPUT EXCEPTION: ${message}`;
  }
}
