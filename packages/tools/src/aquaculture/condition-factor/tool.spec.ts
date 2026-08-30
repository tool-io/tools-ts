import { describe, expect, it } from "vitest";
import {
  calculateConditionFactor,
  example,
  runConditionFactor,
} from "./tool.js";

describe("aquaculture/condition-factor", () => {
  it("calculates the published example", () => {
    expect(calculateConditionFactor(example.input)).toEqual(example.output);
    expect(runConditionFactor(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runConditionFactor({
      ...example.input,
      weightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runConditionFactor({ ...example.input, lengthCentimeters: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "lengthCentimeters" }] },
    });
  });
});
