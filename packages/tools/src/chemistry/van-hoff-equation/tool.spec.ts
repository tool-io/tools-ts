import { describe, expect, it } from "vitest";
import { runVanHoffEquation } from "./tool.js";

describe("Van't Hoff Equation Calculator", () => {
  it("calculates a valid result", () => {
    const result = runVanHoffEquation({
      k1: 1,
      temperature1K: 1,
      temperature2K: 1,
      deltaHJPerMol: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.k2).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runVanHoffEquation(null).ok).toBe(false));
});
