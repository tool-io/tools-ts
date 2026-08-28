import { describe, expect, it } from "vitest";
import { runFaradayMassDeposited } from "./tool.js";
describe("Faraday Mass Deposited", () => {
  it("calculates a valid result", () =>
    expect(
      runFaradayMassDeposited({
        chargeCoulombs: 96485.33212,
        molarMassGPerMol: 63.55,
        electronCount: 2,
      }),
    ).toEqual({
      ok: true,
      output: { depositedMassGrams: 31.775 },
    }));
  it("returns zero deposited mass for zero charge", () =>
    expect(
      runFaradayMassDeposited({
        chargeCoulombs: 0,
        molarMassGPerMol: 63.55,
        electronCount: 2,
      }),
    ).toEqual({ ok: true, output: { depositedMassGrams: 0 } }));
});
