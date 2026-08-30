import { describe, expect, it } from "vitest";
import {
  calculateOxygenConsumption,
  example,
  runOxygenConsumption,
} from "./tool.js";

describe("aquaculture/oxygen-consumption", () => {
  it("calculates the published example", () => {
    expect(calculateOxygenConsumption(example.input)).toEqual(example.output);
    expect(runOxygenConsumption(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runOxygenConsumption({
      ...example.input,
      biomassKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
