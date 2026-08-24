import { describe, expect, it } from "vitest";
import { runTideRange, tideRangeExample as example } from "./tool.js";
describe("tide range", () => {
  it("subtracts low water from high water", () =>
    expect(runTideRange(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("allows zero range", () =>
    expect(runTideRange({ highWaterMeters: 1, lowWaterMeters: 1 })).toEqual({
      ok: true,
      output: { tidalRangeMeters: 0 },
    }));
  it("rejects reversed levels", () =>
    expect(runTideRange({ highWaterMeters: 0, lowWaterMeters: 1 }).ok).toBe(
      false,
    ));
});
