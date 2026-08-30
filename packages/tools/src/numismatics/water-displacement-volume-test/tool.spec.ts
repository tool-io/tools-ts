import { describe, expect, it } from "vitest";
import {
  calculateWaterDisplacementVolumeTest,
  example,
  runWaterDisplacementVolumeTest,
} from "./tool.js";

describe("numismatics/water-displacement-volume-test", () => {
  it("calculates the published example", () => {
    expect(calculateWaterDisplacementVolumeTest(example.input)).toEqual(
      example.output,
    );
    expect(runWaterDisplacementVolumeTest(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWaterDisplacementVolumeTest({
      ...example.input,
      finalWaterMilliliters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      runWaterDisplacementVolumeTest({
        ...example.input,
        finalWaterMilliliters: 49,
      }).ok,
    ).toBe(false);
  });
});
