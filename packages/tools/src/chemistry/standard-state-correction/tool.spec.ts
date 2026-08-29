import { describe, expect, it } from "vitest";
import { runStandardStateCorrection } from "./tool.js";

describe("Standard State Correction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runStandardStateCorrection({
      quotientQ: 1,
      temperatureK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctionKJPerMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runStandardStateCorrection(null).ok).toBe(false));
});
