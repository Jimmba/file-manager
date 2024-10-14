export class InvalidInputException extends Error {
  constructor(message) {
    super();
    this.message = `INVALID INPUT: ${message}`;
  }
}
