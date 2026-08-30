import { describe, expect, it } from "vitest";
import {
  calculateTubeCapacityByDiameter,
  example,
  runTubeCapacityByDiameter,
} from "./tool.js";

describe("numismatics/tube-capacity-by-diameter", () => {
  it("calculates the published example", () => {
    expect(calculateTubeCapacityByDiameter(example.input)).toEqual(
      example.output,
    );
    expect(runTubeCapacityByDiameter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTubeCapacityByDiameter({
      ...example.input,
      tubeInnerDiameterMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
