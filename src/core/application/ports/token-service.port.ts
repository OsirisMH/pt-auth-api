export type AccessTokenPayload = {
  sub: string;     // userId
  email: string;
  roles: string[];
};

export interface TokenServicePort {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  generateRefreshToken(): Promise<string>;
  validateAccessToken(token: string): Promise<AccessTokenPayload>
}