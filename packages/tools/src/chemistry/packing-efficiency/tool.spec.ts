import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculatePackingEfficiency,
  PackingEfficiencyTool,
  packingEfficiencyExample,
  runPackingEfficiency,
} from "./tool.js";

describe("Packing Efficiency Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runPackingEfficiency(packingEfficiencyExample.input)).toEqual({
      ok: true,
      output: packingEfficiencyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(PackingEfficiencyTool)).toEqual([]);
  });

  it("ranks close packing above body-centred above simple cubic", () => {
    const sc = calculatePackingEfficiency({
      unitCellType: "simple-cubic",
    }).packingEfficiencyPercent;
    const fcc = calculatePackingEfficiency({
      unitCellType: "face-centered-cubic",
    }).packingEfficiencyPercent;
    expect(sc).toBeCloseTo(100 * (Math.PI / 6), 12);
    expect(fcc).toBeCloseTo(74, 1);
    expect(fcc).toBeGreaterThan(
      calculatePackingEfficiency({ unitCellType: "body-centered-cubic" })
        .packingEfficiencyPercent,
    );
  });

  it("rejects unknown packings and invalid input", () => {
    expect(runPackingEfficiency({ unitCellType: "diamond-cubic" }).ok).toBe(
      false,
    );
    expect(runPackingEfficiency(null).ok).toBe(false);
  });
});
