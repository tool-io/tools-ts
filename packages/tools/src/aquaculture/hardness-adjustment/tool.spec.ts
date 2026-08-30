import { describe, expect, it } from "vitest";
import {
  calculateHardnessAdjustment,
  example,
  runHardnessAdjustment,
} from "./tool.js";

describe("aquaculture/hardness-adjustment", () => {
  it("calculates the published example", () => {
    expect(calculateHardnessAdjustment(example.input)).toEqual(example.output);
    expect(runHardnessAdjustment(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runHardnessAdjustment({
      ...example.input,
      hardnessIncreaseMgPerLiter: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
