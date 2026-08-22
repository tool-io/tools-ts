import { describe, expect, it } from "vitest";
import { landingWeightExample, runLandingWeight } from "./tool.js";

describe("landing weight calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLandingWeight(landingWeightExample.input)).toEqual({
      ok: true,
      output: { landingWeightLb: 2100 },
    });
  });
  it("rejects burn exceeding takeoff weight through execution", () => {
    expect(
      runLandingWeight({ fuelBurnLb: 3000, takeoffWeightLb: 2400 }).ok,
    ).toBe(false);
  });
});
