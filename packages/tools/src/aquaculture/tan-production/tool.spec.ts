import { describe, expect, it } from "vitest";
import { calculateTanProduction, example, runTanProduction } from "./tool.js";

describe("aquaculture/tan-production", () => {
  it("calculates the published example", () => {
    expect(calculateTanProduction(example.input)).toEqual(example.output);
    expect(runTanProduction(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTanProduction({
      ...example.input,
      dailyFeedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
