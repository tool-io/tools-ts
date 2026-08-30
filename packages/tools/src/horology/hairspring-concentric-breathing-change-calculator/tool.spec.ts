import { describe, expect, it } from "vitest";
import {
  calculateHairspringBreathingGeometry,
  hairspringBreathingGeometryExample,
  runHairspringBreathingGeometry,
} from "./tool.js";

describe("hairspring concentric-breathing geometry calculator", () => {
  it("reproduces the canonical diameter-envelope example", () => {
    expect(
      runHairspringBreathingGeometry(hairspringBreathingGeometryExample.input),
    ).toEqual({ ok: true, output: hairspringBreathingGeometryExample.output });
  });

  it("allows no breathing excursion", () => {
    expect(
      calculateHairspringBreathingGeometry({
        meanDiameterMillimeters: 10,
        radialExcursionMillimeters: 0,
      }),
    ).toMatchObject({
      diameterExcursionMillimeters: 0,
      maximumDiameterMillimeters: 10,
      minimumDiameterMillimeters: 10,
    });
  });

  it("calculates a large caller-supplied envelope", () => {
    expect(
      calculateHairspringBreathingGeometry({
        meanDiameterMillimeters: 20,
        radialExcursionMillimeters: 1,
      }),
    ).toMatchObject({
      diameterExcursionMillimeters: 2,
      excursionRatio: 0.1,
    });
  });

  it("rejects a zero minimum diameter", () => {
    expect(
      runHairspringBreathingGeometry({
        meanDiameterMillimeters: 10,
        radialExcursionMillimeters: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "nonpositive_minimum_diameter",
            field: "radialExcursionMillimeters",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects a negative mean diameter", () => {
    expect(
      runHairspringBreathingGeometry({
        meanDiameterMillimeters: -10,
        radialExcursionMillimeters: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "meanDiameterMillimeters" }],
      },
      ok: false,
    });
  });
});
