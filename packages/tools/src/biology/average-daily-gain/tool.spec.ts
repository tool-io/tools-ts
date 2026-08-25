import { describe, expect, it } from "vitest";
import { averageDailyGainExample, runAverageDailyGain } from "./tool.js";

describe("Average Daily Gain", () => {
  it("publishes an executable example", () =>
    expect(runAverageDailyGain(averageDailyGainExample.input)).toEqual({
      ok: true,
      output: averageDailyGainExample.output,
    }));
  it("is signed and negative during weight loss", () =>
    expect(
      runAverageDailyGain({
        daysElapsed: 180,
        finalWeightKg: 320,
        initialWeightKg: 500,
      }),
    ).toEqual({ ok: true, output: { averageDailyGainKgPerDay: -1 } }));
  it("returns zero for unchanged weights", () =>
    expect(
      runAverageDailyGain({
        daysElapsed: 30,
        finalWeightKg: 480,
        initialWeightKg: 480,
      }),
    ).toEqual({ ok: true, output: { averageDailyGainKgPerDay: 0 } }));
  it("supports fractional periods", () => {
    const result = runAverageDailyGain({
      daysElapsed: 120,
      finalWeightKg: 450,
      initialWeightKg: 300,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.averageDailyGainKgPerDay).toBe(1.25);
  });
  it("rises as the period shortens for equal gains", () => {
    const fast = runAverageDailyGain({
      daysElapsed: 90,
      finalWeightKg: 390,
      initialWeightKg: 300,
    });
    const slow = runAverageDailyGain({
      daysElapsed: 180,
      finalWeightKg: 390,
      initialWeightKg: 300,
    });
    if (fast.ok && slow.ok)
      expect(Number(fast.output.averageDailyGainKgPerDay)).toBeGreaterThan(
        Number(slow.output.averageDailyGainKgPerDay),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero days elapsed", () => {
    const result = runAverageDailyGain({
      daysElapsed: 0,
      finalWeightKg: 500,
      initialWeightKg: 320,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_days");
  });
  it("rejects negative days elapsed", () => {
    const result = runAverageDailyGain({
      daysElapsed: -10,
      finalWeightKg: 500,
      initialWeightKg: 320,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_days");
  });
});
