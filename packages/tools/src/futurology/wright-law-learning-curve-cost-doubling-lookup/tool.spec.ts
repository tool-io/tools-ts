import { describe, expect, it } from "vitest";
import {
  calculateWrightLawUnitCost,
  runWrightLaw,
  wrightLawExample,
} from "./tool.js";

describe("Wright law learning curve cost lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runWrightLaw(wrightLawExample.input)).toEqual({
      ok: true,
      output: wrightLawExample.output,
    });
  });

  it("allows a cost increase when volume decreases", () => {
    expect(
      calculateWrightLawUnitCost({
        endVolume: 50,
        learningRatePercent: 20,
        startUnitCost: 100,
        startVolume: 100,
      }).estimatedEndUnitCost,
    ).toBe(125);
  });

  it("keeps cost unchanged with a zero learning rate", () => {
    expect(
      calculateWrightLawUnitCost({
        endVolume: 400,
        learningRatePercent: 0,
        startUnitCost: 50,
        startVolume: 100,
      }).estimatedEndUnitCost,
    ).toBe(50);
  });

  it("rejects a 100 percent learning rate", () => {
    expect(
      runWrightLaw({
        endVolume: 200,
        learningRatePercent: 100,
        startUnitCost: 100,
        startVolume: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_learning_rate", field: "learningRatePercent" },
        ],
      },
      ok: false,
    });
  });
});
