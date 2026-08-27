import { describe, expect, it } from "vitest";
import {
  calculateFlybackDutyCycle,
  flybackDutyCycleExample,
  runFlybackDutyCycle,
} from "./tool.js";

describe("Flyback Duty", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlybackDutyCycle(flybackDutyCycleExample.input)).toEqual({
      ok: true,
      output: flybackDutyCycleExample.output,
    });
  });

  it("returns fifty percent when the scaled output equals the input", () => {
    expect(
      calculateFlybackDutyCycle({
        vIn: 48,
        vOut: 12,
        turnsRatioNpNs: 4,
      }).flybackDutyCyclePercent,
    ).toBe(50);
  });

  it("weights duty by the turns-scaled output", () => {
    expect(
      calculateFlybackDutyCycle({
        vIn: 100,
        vOut: 10,
        turnsRatioNpNs: 1,
      }).flybackDutyCyclePercent,
    ).toBeCloseTo(9.090909090909092);
  });

  it("increases duty as the primary-to-secondary ratio grows", () => {
    const small = calculateFlybackDutyCycle({
      vIn: 100,
      vOut: 12,
      turnsRatioNpNs: 5,
    }).flybackDutyCyclePercent;
    const large = calculateFlybackDutyCycle({
      vIn: 100,
      vOut: 12,
      turnsRatioNpNs: 15,
    }).flybackDutyCyclePercent;
    expect(large).toBeGreaterThan(small);
  });

  it("stays below one hundred percent for finite inputs", () => {
    const duty = calculateFlybackDutyCycle({
      vIn: 1,
      vOut: 1000000,
      turnsRatioNpNs: 100,
    }).flybackDutyCyclePercent;
    expect(duty).toBeLessThan(100);
  });

  it("rejects a non-positive input voltage", () => {
    expect(
      runFlybackDutyCycle({ vIn: -12, vOut: 5, turnsRatioNpNs: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_v_in" }] },
      ok: false,
    });
  });

  it("rejects a non-positive output voltage", () => {
    expect(
      runFlybackDutyCycle({ vIn: 100, vOut: 0, turnsRatioNpNs: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_v_out" }] },
      ok: false,
    });
  });

  it("rejects a non-positive turns ratio", () => {
    expect(
      runFlybackDutyCycle({ vIn: 100, vOut: 12, turnsRatioNpNs: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_turns_ratio_np_ns" }] },
      ok: false,
    });
  });
});
