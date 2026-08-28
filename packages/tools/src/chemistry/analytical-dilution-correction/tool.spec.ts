import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  analyticalDilutionCorrectionExample,
  analyticalDilutionCorrectionTool,
  calculateAnalyticalDilutionCorrection,
} from "./tool.js";

describe("analytical dilution correction", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateAnalyticalDilutionCorrection(
        analyticalDilutionCorrectionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: analyticalDilutionCorrectionExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(analyticalDilutionCorrectionTool)).toEqual([]);
  });

  it("rejects a final volume smaller than the aliquot", () => {
    expect(
      calculateAnalyticalDilutionCorrection({
        ...analyticalDilutionCorrectionExample.input,
        finalVolumeMl: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "final_volume_below_aliquot" }] },
      ok: false,
    });
  });
});
