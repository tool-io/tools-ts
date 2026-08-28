import { describe, expect, it } from "vitest";
import { runLatticeEnergyBornHaber } from "./tool.js";

describe("Born-Haber Lattice Energy Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runLatticeEnergyBornHaber({
        electronAttachmentEnthalpyKJPerMol: -349,
        formationEnthalpyKJPerMol: -411,
        halfDissociationEnergyKJPerMol: 122,
        ionizationEnergyKJPerMol: 496,
        sublimationEnthalpyKJPerMol: 108,
      }),
    ).toEqual({ ok: true, output: { latticeEnergyKJPerMol: -788 } });
  });
  it("rejects invalid input", () =>
    expect(runLatticeEnergyBornHaber(null).ok).toBe(false));
});
