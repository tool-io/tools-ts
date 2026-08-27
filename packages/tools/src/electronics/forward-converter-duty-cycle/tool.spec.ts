import { describe, expect, it } from "vitest";
import {
  calculateForwardConverterDutyCycle,
  forwardConverterDutyCycleExample,
  runForwardConverterDutyCycle,
} from "./tool.js";

describe("Forward Duty Cycle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runForwardConverterDutyCycle(forwardConverterDutyCycleExample.input),
    ).toEqual({
      ok: true,
      output: forwardConverterDutyCycleExample.output,
    });
  });

  it("returns forty-five percent for a two-to-one step-down", () => {
    expect(
      calculateForwardConverterDutyCycle({
        vIn: 100,
        vOut: 45,
        turnsRatioNsNp: 1,
      }).forwardDutyCyclePercent,
    ).toBeCloseTo(45);
  });

  it("halves the required duty when the secondary has half the turns", () => {
    const full = calculateForwardConverterDutyCycle({
      vIn: 48,
      vOut: 12,
      turnsRatioNsNp: 1,
    }).forwardDutyCyclePercent;
    const halved = calculateForwardConverterDutyCycle({
      vIn: 48,
      vOut: 12,
      turnsRatioNsNp: 0.5,
    }).forwardDutyCyclePercent;
    expect(halved).toBeCloseTo(full * 2);
  });

  it("rejects an impossible conversion ratio", () => {
    expect(
      runForwardConverterDutyCycle({
        vIn: 10,
        vOut: 500,
        turnsRatioNsNp: 1,
      }).ok,
    ).toBe(false);
  });

  it("keeps feasible demands below the clamp untouched", () => {
    expect(
      calculateForwardConverterDutyCycle({
        vIn: 400,
        vOut: 12,
        turnsRatioNsNp: 1,
      }).forwardDutyCyclePercent,
    ).toBe(3);
  });

  it("rejects a non-positive input voltage", () => {
    expect(
      runForwardConverterDutyCycle({ vIn: 0, vOut: 5, turnsRatioNsNp: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_v_in" }] },
      ok: false,
    });
  });

  it("rejects a non-positive output voltage", () => {
    expect(
      runForwardConverterDutyCycle({ vIn: 12, vOut: -3, turnsRatioNsNp: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_v_out" }] },
      ok: false,
    });
  });

  it("rejects a non-positive turns ratio", () => {
    expect(
      runForwardConverterDutyCycle({ vIn: 12, vOut: 5, turnsRatioNsNp: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_turns_ratio_ns_np" }] },
      ok: false,
    });
  });
});
