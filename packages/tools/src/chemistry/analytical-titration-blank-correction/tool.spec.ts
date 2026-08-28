import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateTitrationBlankCorrection,
  titrationBlankCorrectionExample,
  titrationBlankCorrectionTool,
} from "./tool.js";

describe("titration blank correction", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateTitrationBlankCorrection(titrationBlankCorrectionExample.input),
    ).toEqual({
      ok: true,
      output: titrationBlankCorrectionExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(titrationBlankCorrectionTool)).toEqual([]);
  });

  it("rejects a blank larger than the sample volume", () => {
    expect(
      calculateTitrationBlankCorrection({
        blankTitrantVolumeMl: 13,
        sampleTitrantVolumeMl: 12,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "blank_volume_exceeds_sample" }] },
      ok: false,
    });
  });
});
