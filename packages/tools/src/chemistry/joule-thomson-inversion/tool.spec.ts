import { describe, expect, it } from "vitest";
import { runJouleThomsonInversion } from "./tool.js";

describe("Joule-Thomson Inversion Calculator", () => {
  it("calculates a valid result", () => {
    const result = runJouleThomsonInversion({ aAtmL2PerMol2: 1, bLPerMol: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inversionTemperatureK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runJouleThomsonInversion(null).ok).toBe(false));
});
