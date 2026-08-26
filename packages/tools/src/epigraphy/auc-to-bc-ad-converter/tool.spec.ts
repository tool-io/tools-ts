import { describe, expect, it } from "vitest";
import {
  aucToBcAdConverterExample,
  calculateAucToBcAdConverter,
  runAucToBcAdConverter,
} from "./tool.js";

describe("epigraphy/auc-to-bc-ad-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAucToBcAdConverter(aucToBcAdConverterExample.input)).toEqual({
      ok: true,
      output: aucToBcAdConverterExample.output,
    });
  });

  it("maps AUC 754 to AD 1 under the Varronian epoch", () => {
    expect(calculateAucToBcAdConverter({ aucYear: 754 })).toEqual({
      era: "AD",
      year: 1,
      foundingYearBc: 753,
    });
  });

  it("honors alternative founding epochs", () => {
    expect(
      calculateAucToBcAdConverter({
        aucYear: 1,
        foundingEpoch: "dionysian751bc",
      }),
    ).toEqual({ era: "BC", year: 751, foundingYearBc: 751 });
    expect(
      calculateAucToBcAdConverter({
        aucYear: 800,
        foundingEpoch: "polybianCatonian752bc",
      }).year,
    ).toBe(48);
  });

  it("rejects years before the founding", () => {
    expect(runAucToBcAdConverter({ aucYear: 0 }).ok).toBe(false);
  });
});
