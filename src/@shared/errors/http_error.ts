export default class extends Error {
  code: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
  }
}
