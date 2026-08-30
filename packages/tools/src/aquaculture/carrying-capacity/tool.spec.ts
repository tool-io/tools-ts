import { describe, expect, it } from "vitest";
import {
  calculateCarryingCapacity,
  example,
  runCarryingCapacity,
} from "./tool.js";

describe("aquaculture/carrying-capacity", () => {
  it("calculates the published example", () => {
    expect(calculateCarryingCapacity(example.input)).toEqual(example.output);
    expect(runCarryingCapacity(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runCarryingCapacity({
      ...example.input,
      waterVolumeCubicMeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
