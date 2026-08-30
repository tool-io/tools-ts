import { describe, expect, it } from "vitest";
import {
  calculateAlkalinityRequirement,
  example,
  runAlkalinityRequirement,
} from "./tool.js";

describe("aquaculture/alkalinity-requirement", () => {
  it("calculates the published example", () => {
    expect(calculateAlkalinityRequirement(example.input)).toEqual(
      example.output,
    );
    expect(runAlkalinityRequirement(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAlkalinityRequirement({
      ...example.input,
      tanOxidizedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
