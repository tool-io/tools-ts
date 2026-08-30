import { describe, expect, it } from "vitest";
import { calculateHatchingRate, example, runHatchingRate } from "./tool.js";

describe("aquaculture/hatching-rate", () => {
  it("calculates the published example", () => {
    expect(calculateHatchingRate(example.input)).toEqual(example.output);
    expect(runHatchingRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runHatchingRate({
      ...example.input,
      hatchedLarvae: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(runHatchingRate({ ...example.input, viableEggs: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "viableEggs" }] },
    });
  });
});
