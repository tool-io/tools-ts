import { describe, expect, it } from "vitest";
import {
  calculateStockingDensity,
  example,
  runStockingDensity,
} from "./tool.js";

describe("aquaculture/stocking-density", () => {
  it("calculates the published example", () => {
    expect(calculateStockingDensity(example.input)).toEqual(example.output);
    expect(runStockingDensity(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runStockingDensity({
      ...example.input,
      biomassKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runStockingDensity({ ...example.input, waterVolumeCubicMeters: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "waterVolumeCubicMeters" }] },
    });
  });
});
