export class InvalidCredentialsError extends Error {
  readonly name = 'InvalidCredentialsError';
  constructor() {
    super('Invalid credentials');
  }
}

export class UserInactiveError extends Error {
  readonly name = 'UserInactiveError';
  constructor() {
    super('User is inactive');
  }
}

export class RefreshTokenInvalidError extends Error {
  readonly name = 'RefreshTokenInvalidError';
  constructor() {
    super('Invalid refresh token');
  }
}

export class RefreshTokenExpiredError extends Error {
  readonly name = 'RefreshTokenExpiredError';
  constructor() {
    super('Refresh token expired');
  }
}

export class AccessTokenInvalidError extends Error {
  readonly name = 'AccessTokenInvalidError';
  constructor() {
    super('Invalid access token');
  }
}