import { describe, expect, it } from "vitest";
import { runBoyleTemperature } from "./tool.js";

describe("Boyle Temperature Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBoyleTemperature({ aAtmL2PerMol2: 1, bLPerMol: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.boyleTemperatureK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBoyleTemperature(null).ok).toBe(false));
});
