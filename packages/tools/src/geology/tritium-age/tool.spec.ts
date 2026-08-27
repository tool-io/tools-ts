import { describe, expect, it } from "vitest";
import {
  calculateTritiumAge,
  runTritiumAge,
  tritiumAgeExample,
} from "./tool.js";

describe("tritium-age", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTritiumAge(tritiumAgeExample.input)).toEqual({
      ok: true,
      output: tritiumAgeExample.output,
    });
  });

  it("defaults to the 12.32-year half-life", () => {
    const result = calculateTritiumAge({
      initialTritiumTU: 40,
      measuredTritiumTU: 5,
    });
    expect(result.ageYears).toBeCloseTo(3 * 12.32, 9);
  });

  it("rejects non-positive activities", () => {
    expect(
      runTritiumAge({ initialTritiumTU: 10, measuredTritiumTU: 0 }).ok,
    ).toBe(false);
  });
});
