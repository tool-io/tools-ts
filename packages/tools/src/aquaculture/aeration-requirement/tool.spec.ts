import { describe, expect, it } from "vitest";
import {
  calculateAerationRequirement,
  example,
  runAerationRequirement,
} from "./tool.js";

describe("aquaculture/aeration-requirement", () => {
  it("calculates the published example", () => {
    expect(calculateAerationRequirement(example.input)).toEqual(example.output);
    expect(runAerationRequirement(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAerationRequirement({
      ...example.input,
      oxygenDemandKgPerHour: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
