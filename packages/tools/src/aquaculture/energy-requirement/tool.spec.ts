import { describe, expect, it } from "vitest";
import {
  calculateEnergyRequirement,
  example,
  runEnergyRequirement,
} from "./tool.js";

describe("aquaculture/energy-requirement", () => {
  it("calculates the published example", () => {
    expect(calculateEnergyRequirement(example.input)).toEqual(example.output);
    expect(runEnergyRequirement(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runEnergyRequirement({
      ...example.input,
      dailyFeedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
