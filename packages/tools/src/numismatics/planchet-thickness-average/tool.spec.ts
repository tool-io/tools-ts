import { describe, expect, it } from "vitest";
import {
  calculatePlanchetThicknessAverage,
  example,
  runPlanchetThicknessAverage,
} from "./tool.js";

describe("numismatics/planchet-thickness-average", () => {
  it("calculates the published example", () => {
    expect(calculatePlanchetThicknessAverage(example.input)).toEqual(
      example.output,
    );
    expect(runPlanchetThicknessAverage(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPlanchetThicknessAverage({
      ...example.input,
      firstThicknessMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
