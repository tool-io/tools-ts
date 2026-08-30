import { describe, expect, it } from "vitest";
import {
  mainspringBarrelFitExample,
  runMainspringBarrelFit,
  screenMainspringBarrelFit,
} from "./tool.js";

describe("mainspring barrel envelope screen", () => {
  it("reproduces the canonical fitting example", () => {
    expect(runMainspringBarrelFit(mainspringBarrelFitExample.input)).toEqual({
      ok: true,
      output: mainspringBarrelFitExample.output,
    });
  });

  it("accepts dimensions exactly at the radial limit", () => {
    expect(
      screenMainspringBarrelFit({
        barrelInnerDiameterMillimeters: 10,
        barrelArborDiameterMillimeters: 2,
        requiredRadialClearanceMillimeters: 0,
        requiredSpringRadialEnvelopeMillimeters: 4,
        availableBarrelHeightMillimeters: 2,
        replacementSpringHeightMillimeters: 2,
      }).fitsCallerDimensions,
    ).toBe(true);
  });

  it("rejects a radial envelope wider than the available annulus", () => {
    expect(
      screenMainspringBarrelFit({
        barrelInnerDiameterMillimeters: 10,
        barrelArborDiameterMillimeters: 2,
        requiredRadialClearanceMillimeters: 0.5,
        requiredSpringRadialEnvelopeMillimeters: 4,
        availableBarrelHeightMillimeters: 2,
        replacementSpringHeightMillimeters: 1.5,
      }),
    ).toMatchObject({
      availableRadialEnvelopeMillimeters: 3.5,
      fitsCallerDimensions: false,
    });
  });

  it("rejects a spring taller than the available barrel", () => {
    expect(
      screenMainspringBarrelFit({
        barrelInnerDiameterMillimeters: 10,
        barrelArborDiameterMillimeters: 2,
        requiredRadialClearanceMillimeters: 0,
        requiredSpringRadialEnvelopeMillimeters: 1,
        availableBarrelHeightMillimeters: 1.5,
        replacementSpringHeightMillimeters: 1.6,
      }).fitsCallerDimensions,
    ).toBe(false);
  });

  it("rejects an arbor equal to the barrel inner diameter", () => {
    expect(
      runMainspringBarrelFit({
        barrelInnerDiameterMillimeters: 10,
        barrelArborDiameterMillimeters: 10,
        requiredRadialClearanceMillimeters: 0,
        requiredSpringRadialEnvelopeMillimeters: 1,
        availableBarrelHeightMillimeters: 2,
        replacementSpringHeightMillimeters: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "arbor_not_inside_barrel",
            field: "barrelArborDiameterMillimeters",
          },
        ],
      },
      ok: false,
    });
  });
});
