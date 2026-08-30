import { simpleError } from "../core/simple.js";
import { bounded } from "../game/shared.js";
export * from "../glaciology/batch32-shared.js";
export const repeater = (
  hour: number,
  minute: number,
): { hours: number; quarters: number; minutes: number; sequence: string[] } => {
  bounded(hour, "hour", 0, 23);
  bounded(minute, "minute", 0, 59);
  const hours = hour % 12 || 12,
    quarters = Math.floor(minute / 15),
    minutes = minute % 15;
  return {
    hours,
    quarters,
    minutes,
    sequence: [
      ...Array<string>(hours).fill("low"),
      ...Array.from({ length: quarters }, () => ["high", "low"]).flat(),
      ...Array<string>(minutes).fill("high"),
    ],
  };
};
export const sonnerie = (
  grand: boolean,
  enabledQuarterSlots: readonly number[],
): {
  hourStrikes: number;
  quarterPairs: number;
  totalHammerStrikes: number;
  byQuarterSlot: number[];
} => {
  if (
    enabledQuarterSlots.length !== 96 ||
    enabledQuarterSlots.some((v) => v !== 0 && v !== 1)
  )
    return simpleError(
      "schedule",
      "Exactly 96 binary quarter-hour enable flags in a caller 24-hour day required.",
    );
  let hourStrikes = 0,
    quarterPairs = 0;
  const byQuarterSlot = enabledQuarterSlots.map((flag, i) => {
    if (!flag) return 0;
    const hour = Math.floor(i / 4) % 12 || 12,
      q = i % 4,
      h = grand || q === 0 ? hour : 0;
    hourStrikes += h;
    quarterPairs += q;
    return h + 2 * q;
  });
  return {
    hourStrikes,
    quarterPairs,
    totalHammerStrikes: hourStrikes + 2 * quarterPairs,
    byQuarterSlot,
  };
};
