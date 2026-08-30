import { describe, expect, it } from "vitest";
import {
  calculateFultonConditionFactor,
  example,
  runFultonConditionFactor,
} from "./tool.js";

describe("aquaculture/fulton-condition-factor", () => {
  it("calculates the published example", () => {
    expect(calculateFultonConditionFactor(example.input)).toEqual(
      example.output,
    );
    expect(runFultonConditionFactor(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFultonConditionFactor({
      ...example.input,
      weightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateFultonConditionFactor({
        weightGrams: 100,
        lengthCentimeters: 20,
      }).fultonConditionFactor,
    ).toBe(1.25);
  });
  it("rejects a zero denominator", () => {
    expect(
      runFultonConditionFactor({ ...example.input, lengthCentimeters: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "lengthCentimeters" }] },
    });
  });
});
