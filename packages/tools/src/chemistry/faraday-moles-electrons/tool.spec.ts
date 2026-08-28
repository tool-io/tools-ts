import { describe, expect, it } from "vitest";
import { runFaradayMolesElectrons } from "./tool.js";

describe("Faraday Moles of Electrons Calculator", () => {
  it("calculates a valid result", () => {
    const result = runFaradayMolesElectrons({ chargeCoulombs: 96485.33212 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molesElectrons).toBeCloseTo(1, 6);
  });

  it("rejects invalid input", () =>
    expect(runFaradayMolesElectrons(null).ok).toBe(false));
});
