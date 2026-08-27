import { describe, expect, it } from "vitest";
import { runWoundHealingRate, woundHealingRateExample } from "./tool.js";

describe("Wound Healing Rate", () => {
  it("publishes an executable example", () =>
    expect(runWoundHealingRate(woundHealingRateExample.input)).toEqual({
      ok: true,
      output: woundHealingRateExample.output,
    }));
  it("divides healed area by days elapsed", () =>
    expect(
      runWoundHealingRate({
        currentAreaMm2: 20,
        daysElapsed: 12,
        initialAreaMm2: 80,
      }),
    ).toEqual({ ok: true, output: { healingRateMm2PerDay: 5 } }));
  it("accepts fractional areas and days", () =>
    expect(
      runWoundHealingRate({
        currentAreaMm2: 25.25,
        daysElapsed: 3,
        initialAreaMm2: 50.5,
      }),
    ).toEqual({
      ok: true,
      output: { healingRateMm2PerDay: 8.416666666666666 },
    }));
  it("yields zero for an unchanged wound", () =>
    expect(
      runWoundHealingRate({
        currentAreaMm2: 100,
        daysElapsed: 7,
        initialAreaMm2: 100,
      }),
    ).toEqual({ ok: true, output: { healingRateMm2PerDay: 0 } }));
  it("rejects zero days elapsed", () => {
    const result = runWoundHealingRate({
      currentAreaMm2: 60,
      daysElapsed: 0,
      initialAreaMm2: 100,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative days elapsed", () => {
    const result = runWoundHealingRate({
      currentAreaMm2: 60,
      daysElapsed: -3,
      initialAreaMm2: 100,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative areas", () =>
    expect(
      runWoundHealingRate({
        currentAreaMm2: -1,
        daysElapsed: 4,
        initialAreaMm2: 100,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runWoundHealingRate({ daysElapsed: 4 }).ok).toBe(false));
});
