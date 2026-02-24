import type { ClockPort } from '../../../core/application/ports/clock.port';

export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  }
}
