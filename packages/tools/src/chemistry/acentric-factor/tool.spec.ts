import { describe, expect, it } from "vitest";
import { runAcentricFactor } from "./tool.js";

describe("Acentric Factor Lookup", () => {
  it("calculates a valid result", () => {
    const result = runAcentricFactor({ substance: "water" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.omega).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runAcentricFactor(null).ok).toBe(false));
  it("rejects an unknown substance", () =>
    expect(runAcentricFactor({ substance: "unobtainium" }).ok).toBe(false));
});
