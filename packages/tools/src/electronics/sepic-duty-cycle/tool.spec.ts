import { describe, expect, it } from "vitest";
import {
  calculateSepicDutyCycle,
  runSepicDutyCycle,
  sepicDutyCycleExample,
} from "./tool.js";

describe("SEPIC Duty", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSepicDutyCycle(sepicDutyCycleExample.input)).toEqual({
      ok: true,
      output: sepicDutyCycleExample.output,
    });
  });

  it("returns one third for an output half the input", () => {
    expect(
      calculateSepicDutyCycle({ vIn: 12, vOut: 6 }).sepicDutyCyclePercent,
    ).toBeCloseTo(100 / 3);
  });

  it("uses the ideal conversion-ratio equation", () => {
    expect(
      calculateSepicDutyCycle({ vIn: 24, vOut: 6 }).sepicDutyCyclePercent,
    ).toBeCloseTo(20);
  });

  it("approaches one hundred percent for an extreme step-up ratio", () => {
    expect(
      calculateSepicDutyCycle({ vIn: 1, vOut: 1000 }).sepicDutyCyclePercent,
    ).toBeCloseTo((1000 / 1001) * 100);
  });

  it("returns just under fifty percent when output is just below input", () => {
    expect(
      calculateSepicDutyCycle({ vIn: 20, vOut: 19 }).sepicDutyCyclePercent,
    ).toBeCloseTo((19 / 39) * 100);
  });

  it("handles ordinary conversion ratios", () => {
    expect(
      calculateSepicDutyCycle({ vIn: 4, vOut: 3 }).sepicDutyCyclePercent,
    ).toBeCloseTo((3 / 7) * 100);
  });

  it("rejects a non-positive input voltage", () => {
    expect(runSepicDutyCycle({ vIn: 0, vOut: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_v_in" }] },
      ok: false,
    });
  });

  it("rejects a non-positive output voltage", () => {
    expect(runSepicDutyCycle({ vIn: 12, vOut: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_v_out" }] },
      ok: false,
    });
  });
});
