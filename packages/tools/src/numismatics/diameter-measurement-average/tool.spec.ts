import { describe, expect, it } from "vitest";
import {
  calculateDiameterMeasurementAverage,
  example,
  runDiameterMeasurementAverage,
} from "./tool.js";

describe("numismatics/diameter-measurement-average", () => {
  it("calculates the published example", () => {
    expect(calculateDiameterMeasurementAverage(example.input)).toEqual(
      example.output,
    );
    expect(runDiameterMeasurementAverage(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDiameterMeasurementAverage({
      ...example.input,
      firstDiameterMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
