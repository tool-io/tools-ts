import { describe, expect, it } from "vitest";
import { runSubthresholdSwing, subthresholdSwingExample } from "./tool.js";

describe("MOSFET subthreshold swing", () => {
  it("reproduces the documented example", () =>
    expect(runSubthresholdSwing(subthresholdSwingExample.input)).toEqual({
      ok: true,
      output: subthresholdSwingExample.output,
    }));
  it("gives the 300 K thermal limit when the capacitance ratio is zero", () => {
    const result = runSubthresholdSwing({
      depletionToOxideCapacitanceRatio: 0,
    });
    expect(result.ok && result.output.subthresholdSwingMVPerDecade).toBeCloseTo(
      59.52642933132886,
      12,
    );
  });
  it("scales linearly with absolute temperature", () => {
    const result = runSubthresholdSwing({
      depletionToOxideCapacitanceRatio: 0,
      temperatureKelvin: 600,
    });
    expect(result.ok && result.output.subthresholdSwingMVPerDecade).toBeCloseTo(
      119.05285866265772,
      12,
    );
  });
});
