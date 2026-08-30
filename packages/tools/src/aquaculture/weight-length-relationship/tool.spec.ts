import { describe, expect, it } from "vitest";
import {
  calculateWeightLengthRelationship,
  example,
  runWeightLengthRelationship,
} from "./tool.js";

describe("aquaculture/weight-length-relationship", () => {
  it("calculates the published example", () => {
    expect(calculateWeightLengthRelationship(example.input)).toEqual(
      example.output,
    );
    expect(runWeightLengthRelationship(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWeightLengthRelationship({
      ...example.input,
      coefficientA: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
