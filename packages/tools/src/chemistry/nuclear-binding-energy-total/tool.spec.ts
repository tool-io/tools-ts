import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNuclearBindingEnergyTotal,
  nuclearBindingEnergyTotalExample,
  nuclearBindingEnergyTotalTool,
} from "./tool.js";

describe("total nuclear binding energy", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateNuclearBindingEnergyTotal(
        nuclearBindingEnergyTotalExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nuclearBindingEnergyTotalExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(nuclearBindingEnergyTotalTool)).toEqual([]);
  });

  it("rejects a zero mass defect", () => {
    expect(
      calculateNuclearBindingEnergyTotal({ massDefectKg: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "positive_finite_number_required" }] },
      ok: false,
    });
  });
});
