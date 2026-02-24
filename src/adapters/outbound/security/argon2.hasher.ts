import argon2 from 'argon2';
import type { PasswordHasherPort } from '../../../core/application/ports/password-hasher.port';

export class Argon2Hasher implements PasswordHasherPort {
  async verify(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }
}