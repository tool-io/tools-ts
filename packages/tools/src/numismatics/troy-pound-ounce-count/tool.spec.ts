import { describe, expect, it } from "vitest";
import {
  calculateTroyPoundOunceCount,
  example,
  runTroyPoundOunceCount,
} from "./tool.js";

describe("numismatics/troy-pound-ounce-count", () => {
  it("calculates the published example", () => {
    expect(calculateTroyPoundOunceCount(example.input)).toEqual(example.output);
    expect(runTroyPoundOunceCount(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTroyPoundOunceCount({
      ...example.input,
      troyPounds: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
