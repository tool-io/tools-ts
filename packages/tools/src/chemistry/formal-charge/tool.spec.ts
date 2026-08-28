import { describe, expect, it } from "vitest";
import { runFormalCharge } from "./tool.js";

describe("Formal Charge Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runFormalCharge({
        bondingElectrons: 2,
        nonbondingElectrons: 0,
        valenceElectrons: 4,
      }),
    ).toEqual({ ok: true, output: { formalCharge: 3 } });
    expect(
      runFormalCharge({
        bondingElectrons: 6,
        nonbondingElectrons: 2,
        valenceElectrons: 6,
      }),
    ).toEqual({ ok: true, output: { formalCharge: 1 } });
  });

  it("rejects invalid input", () =>
    expect(runFormalCharge(null).ok).toBe(false));
});
