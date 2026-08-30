import { describe, expect, it } from "vitest";
import {
  calculateLarvalSurvivalRate,
  example,
  runLarvalSurvivalRate,
} from "./tool.js";

describe("aquaculture/larval-survival-rate", () => {
  it("calculates the published example", () => {
    expect(calculateLarvalSurvivalRate(example.input)).toEqual(example.output);
    expect(runLarvalSurvivalRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runLarvalSurvivalRate({
      ...example.input,
      survivingLarvae: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runLarvalSurvivalRate({ ...example.input, initialLarvae: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "initialLarvae" }] },
    });
  });
});
