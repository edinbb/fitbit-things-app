export class FetchError extends Error {
  constructor(msg) {
    super(msg);
    this.t = "fetch";
  }
}

export class ForbiddenError extends Error {
  constructor(msg) {
    super(msg);
    this.t = "forbidden";
  }
}

export class UnauthorizedError extends Error {
  constructor(msg) {
    super(msg);
    this.t = "unauthorized";
  }
}

export class SettingsError extends Error {
  constructor(msg) {
    super(msg);
    this.t = "settings";
  }
}