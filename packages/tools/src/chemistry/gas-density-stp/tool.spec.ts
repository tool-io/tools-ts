import { describe, expect, it } from "vitest";
import { runGasDensityStp } from "./tool.js";
describe("Gas Density STP", () => {
  it("calculates a valid result", () =>
    expect(runGasDensityStp({ molarMassGPerMol: 32 })).toEqual({
      ok: true,
      output: { densityGPL: 1.4276791291157311 },
    }));
  it("rejects invalid input", () =>
    expect(runGasDensityStp({ molarMassGPerMol: 0 }).ok).toBe(false));
});
