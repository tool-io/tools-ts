import { describe, expect, it } from "vitest";
import {
  calculateProteinRequirement,
  example,
  runProteinRequirement,
} from "./tool.js";

describe("aquaculture/protein-requirement", () => {
  it("calculates the published example", () => {
    expect(calculateProteinRequirement(example.input)).toEqual(example.output);
    expect(runProteinRequirement(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runProteinRequirement({
      ...example.input,
      dailyFeedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
