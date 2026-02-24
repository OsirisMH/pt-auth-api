export interface ClockPort {
  now(): Date;
  addDays(date: Date, days: number): Date;
}