import { describe, expect, it } from "vitest";
import {
  calculateTemperatureCorrectionGrowth,
  example,
  runTemperatureCorrectionGrowth,
} from "./tool.js";

describe("aquaculture/temperature-correction-growth", () => {
  it("calculates the published example", () => {
    expect(calculateTemperatureCorrectionGrowth(example.input)).toEqual(
      example.output,
    );
    expect(runTemperatureCorrectionGrowth(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTemperatureCorrectionGrowth({
      ...example.input,
      baselineGrowthRate: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
