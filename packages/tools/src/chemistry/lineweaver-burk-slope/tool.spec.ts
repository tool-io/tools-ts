import { describe, expect, it } from "vitest";
import { runLineweaverBurkSlope } from "./tool.js";

describe("Lineweaver-Burk Slope Calculator", () => {
  it("calculates a valid result", () => {
    const result = runLineweaverBurkSlope({ km: 1, vmax: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.slope).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runLineweaverBurkSlope(null).ok).toBe(false));
});
