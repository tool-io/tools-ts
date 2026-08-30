import { describe, expect, it } from "vitest";
import { calculateSurvivalRate, example, runSurvivalRate } from "./tool.js";

describe("aquaculture/survival-rate", () => {
  it("calculates the published example", () => {
    expect(calculateSurvivalRate(example.input)).toEqual(example.output);
    expect(runSurvivalRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSurvivalRate({
      ...example.input,
      survivingAnimals: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      runSurvivalRate({ survivingAnimals: 101, initialAnimals: 100 }).ok,
    ).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runSurvivalRate({ ...example.input, initialAnimals: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "initialAnimals" }] },
    });
  });
});
