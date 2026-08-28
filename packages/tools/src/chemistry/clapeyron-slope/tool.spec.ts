import { describe, expect, it } from "vitest";
import { runClapeyronSlope } from "./tool.js";

describe("Clapeyron Slope Calculator", () => {
  it("calculates a valid result", () => {
    const result = runClapeyronSlope({
      deltaHJPerMol: 1,
      temperatureK: 1,
      deltaVM3PerMol: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.slopePaPerK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runClapeyronSlope(null).ok).toBe(false));
});
