import { describe, expect, it } from "vitest";
import {
  calculateFanoutCalculation,
  fanoutCalculationExample,
  runFanoutCalculation,
} from "./tool.js";

describe("Logic Fanout", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFanoutCalculation(fanoutCalculationExample.input)).toEqual({
      ok: true,
      output: fanoutCalculationExample.output,
    });
  });

  it("floors fractional current ratios", () => {
    expect(
      calculateFanoutCalculation({ driveCurrentMa: 10, inputCurrentMa: 3 })
        .maxFanout,
    ).toBe(3);
  });

  it("returns an exact count when currents divide evenly", () => {
    expect(
      calculateFanoutCalculation({ driveCurrentMa: 40, inputCurrentMa: 8 })
        .maxFanout,
    ).toBe(5);
  });

  it("supports micro-scale currents", () => {
    expect(
      calculateFanoutCalculation({
        driveCurrentMa: 0.02,
        inputCurrentMa: 0.001,
      }).maxFanout,
    ).toBe(20);
  });

  it("allows a single load just above the drive budget", () => {
    expect(
      calculateFanoutCalculation({ driveCurrentMa: 4.4, inputCurrentMa: 4 })
        .maxFanout,
    ).toBe(1);
  });

  it("rejects zero drive current", () => {
    expect(
      runFanoutCalculation({ driveCurrentMa: 0, inputCurrentMa: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_drive_current_ma" }] },
      ok: false,
    });
  });

  it("rejects negative input current", () => {
    expect(
      runFanoutCalculation({ driveCurrentMa: 20, inputCurrentMa: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input_current_ma" }] },
      ok: false,
    });
  });
});
