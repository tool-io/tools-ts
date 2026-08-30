import { describe, expect, it } from "vitest";
import {
  rotatingArchitectureExample,
  runRotatingArchitecture,
  screenCarrouselTourbillonArchitecture,
} from "./tool.js";

describe("carrousel-versus-tourbillon architecture screen", () => {
  it("reproduces the canonical tourbillon-like example", () => {
    expect(runRotatingArchitecture(rotatingArchitectureExample.input)).toEqual({
      ok: true,
      output: rotatingArchitectureExample.output,
    });
  });

  it("screens uncoupled cage architecture as carrousel-like", () => {
    expect(
      screenCarrouselTourbillonArchitecture({
        cageCoupledToSecondsHand: false,
        cageRotationPeriodSeconds: 3600,
        regulatorMountedInCage: true,
      }),
    ).toMatchObject({
      architectureScreen: "carrouselLike",
      cageRevolutionsPerDay: 24,
    });
  });

  it("does not classify a cage without the regulator", () => {
    expect(
      screenCarrouselTourbillonArchitecture({
        cageCoupledToSecondsHand: true,
        cageRotationPeriodSeconds: 60,
        regulatorMountedInCage: false,
      }).architectureScreen,
    ).toBe("notARotatingRegulator");
  });

  it("rejects a zero cage period", () => {
    expect(
      runRotatingArchitecture({
        cageCoupledToSecondsHand: true,
        cageRotationPeriodSeconds: 0,
        regulatorMountedInCage: true,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "cage_period_invalid", field: "cageRotationPeriodSeconds" },
        ],
      },
      ok: false,
    });
  });
});
