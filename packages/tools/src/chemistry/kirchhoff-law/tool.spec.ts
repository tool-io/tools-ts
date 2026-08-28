import { describe, expect, it } from "vitest";
import { runKirchhoffLaw } from "./tool.js";

describe("Kirchhoff Law Calculator", () => {
  it("calculates a valid result", () => {
    const result = runKirchhoffLaw({
      deltaHT1KJPerMol: 1,
      deltaCpKJPerMolK: 1,
      t1K: 1,
      t2K: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deltaHT2KJPerMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runKirchhoffLaw(null).ok).toBe(false));
});
