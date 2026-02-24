import jwt from 'jsonwebtoken';
import type { TokenServicePort, AccessTokenPayload } from '../../../core/application/ports/token-service.port';
import { randomBytes } from 'crypto';

export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly privateKeyPem: string,
    private readonly publicKeyPem: string,
    private readonly issuer: string,
    private readonly audience: string,
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.privateKeyPem,
        {
          algorithm: 'RS256',
          expiresIn: '15m',
          issuer: this.issuer,
          audience: this.audience,
        },
        (err, token) => {
          if (err || !token) return reject(err ?? new Error('Token signing failed'));
          resolve(token);
        },
      );
    });
  }

  async generateRefreshToken(): Promise<string> {
    return randomBytes(48).toString('base64url');
  }

  async validateAccessToken(token: string): Promise<AccessTokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.publicKeyPem,
        {
          algorithms: ['RS256'],
          issuer: this.issuer,
          audience: this.audience,
        },
        (err, decoded) => {
          if (err || !decoded || typeof decoded !== 'object') return reject(err ?? new Error('Invalid token'));

          const d = decoded as any;
          resolve({
            sub: String(d.sub),
            email: String(d.email ?? ''),
            roles: Array.isArray(d.roles) ? d.roles.map(String) : [],
          });
        },
      );
    });
  }
}