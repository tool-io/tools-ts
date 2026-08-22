import { describe, expect, it } from "vitest";
import { runZodiacSign, zodiacSignExample } from "./tool.js";

describe("Zodiac Sign Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runZodiacSign(zodiacSignExample.input)).toEqual({
      ok: true,
      output: zodiacSignExample.output,
    }));
  it("splits the March equinox cusp between Pisces and Aries", () => {
    expect(runZodiacSign({ day: 20, month: 3 })).toEqual({
      ok: true,
      output: { sign: "Pisces" },
    });
    expect(runZodiacSign({ day: 21, month: 3 })).toEqual({
      ok: true,
      output: { sign: "Aries" },
    });
  });
  it("splits every adjacent pair at its start date", () => {
    expect(runZodiacSign({ day: 19, month: 4 }).ok).toBe(true);
    const boundaries = [
      [{ day: 18, month: 2 }, "Aquarius"],
      [{ day: 19, month: 4 }, "Aries"],
      [{ day: 20, month: 4 }, "Taurus"],
      [{ day: 20, month: 5 }, "Taurus"],
      [{ day: 21, month: 5 }, "Gemini"],
      [{ day: 20, month: 6 }, "Gemini"],
      [{ day: 21, month: 6 }, "Cancer"],
      [{ day: 22, month: 7 }, "Cancer"],
      [{ day: 23, month: 7 }, "Leo"],
      [{ day: 22, month: 8 }, "Leo"],
      [{ day: 23, month: 8 }, "Virgo"],
      [{ day: 22, month: 9 }, "Virgo"],
      [{ day: 23, month: 9 }, "Libra"],
      [{ day: 22, month: 10 }, "Libra"],
      [{ day: 23, month: 10 }, "Scorpio"],
      [{ day: 21, month: 11 }, "Scorpio"],
      [{ day: 22, month: 11 }, "Sagittarius"],
      [{ day: 21, month: 12 }, "Sagittarius"],
      [{ day: 22, month: 12 }, "Capricorn"],
      [{ day: 19, month: 1 }, "Capricorn"],
      [{ day: 20, month: 1 }, "Aquarius"],
    ] as const;
    for (const [input, sign] of boundaries)
      expect(runZodiacSign(input)).toEqual({ ok: true, output: { sign } });
  });
  it("ends signs on their standard last days", () => {
    expect(runZodiacSign({ day: 19, month: 4 })).toEqual({
      ok: true,
      output: { sign: "Aries" },
    });
    expect(runZodiacSign({ day: 22, month: 8 })).toEqual({
      ok: true,
      output: { sign: "Leo" },
    });
    expect(runZodiacSign({ day: 21, month: 11 })).toEqual({
      ok: true,
      output: { sign: "Scorpio" },
    });
  });
  it("accepts February 29 as a leap-aware valid day", () =>
    expect(runZodiacSign({ day: 29, month: 2 })).toEqual({
      ok: true,
      output: { sign: "Pisces" },
    }));
  it("rejects days beyond the month length with invalid_day", () => {
    const result = runZodiacSign({ day: 30, month: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_day");
    expect(runZodiacSign({ day: 31, month: 4 }).ok).toBe(false);
    expect(runZodiacSign({ day: 31, month: 6 }).ok).toBe(false);
  });
  it("rejects out-of-range months and days", () => {
    expect(runZodiacSign({ day: 15, month: 13 }).ok).toBe(false);
    expect(runZodiacSign({ day: 0, month: 6 }).ok).toBe(false);
    expect(runZodiacSign({ day: 32, month: 6 }).ok).toBe(false);
  });
  it("rejects malformed input", () => {
    expect(runZodiacSign(null).ok).toBe(false);
    expect(runZodiacSign({}).ok).toBe(false);
    expect(runZodiacSign({ day: 3.5, month: 6 }).ok).toBe(false);
    expect(runZodiacSign({ day: "21", month: 3 }).ok).toBe(false);
  });
});
