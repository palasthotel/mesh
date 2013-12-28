/**
 * Default exception.
 */
export class Exception {
  public name = "Exception";

  constructor(public message: string) {
  }

  public toString(): string {
    return this.name + ": " + this.message;
  }
}

/**
 * The requested element could not be found.
 */
export class NoSuchElementException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = "NoSuchElementException";
  }
}

/**
 * An illegal argument was provided.
 */
export class IllegalArgumentException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = "IllegalArgumentException";
  }
}
