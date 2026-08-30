import { describe, expect, it } from "vitest";
import {
  crystalFitExample,
  runCrystalFit,
  screenCrystalReplacementFit,
} from "./tool.js";

describe("crystal replacement fit-dimension calculator", () => {
  it("reproduces the canonical fitting example", () => {
    expect(runCrystalFit(crystalFitExample.input)).toEqual({
      ok: true,
      output: crystalFitExample.output,
    });
  });

  it("accepts dimensions exactly at the depth limit", () => {
    expect(
      screenCrystalReplacementFit({
        caseOpeningDiameterMillimeters: 30,
        crystalDiameterMillimeters: 30,
        availableCrystalDepthMillimeters: 1.5,
        crystalThicknessMillimeters: 1.5,
        maximumThicknessMillimeters: 1.5,
      }).fitsCallerDimensions,
    ).toBe(true);
  });

  it("rejects a crystal wider than the caller-supplied opening", () => {
    expect(
      screenCrystalReplacementFit({
        caseOpeningDiameterMillimeters: 30,
        crystalDiameterMillimeters: 30.1,
        availableCrystalDepthMillimeters: 2,
        crystalThicknessMillimeters: 1.5,
        maximumThicknessMillimeters: 1.8,
      }),
    ).toMatchObject({
      diameterShoulderClearanceMillimeters: -0.10000000000000142,
      fitsCallerDimensions: false,
    });
  });

  it("rejects a crystal thicker than the caller maximum", () => {
    expect(
      screenCrystalReplacementFit({
        caseOpeningDiameterMillimeters: 30,
        crystalDiameterMillimeters: 29.8,
        availableCrystalDepthMillimeters: 3,
        crystalThicknessMillimeters: 1.9,
        maximumThicknessMillimeters: 1.8,
      }).fitsCallerDimensions,
    ).toBe(false);
  });

  it("rejects a zero case opening", () => {
    expect(
      runCrystalFit({
        caseOpeningDiameterMillimeters: 0,
        crystalDiameterMillimeters: 29,
        availableCrystalDepthMillimeters: 2,
        crystalThicknessMillimeters: 1.5,
        maximumThicknessMillimeters: 1.8,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "case_opening_invalid",
            field: "caseOpeningDiameterMillimeters",
          },
        ],
      },
      ok: false,
    });
  });
});
