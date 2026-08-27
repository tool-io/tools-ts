import { describe, expect, it } from "vitest";
import {
  bearingCapacityFactorNgammaExample,
  runBearingCapacityFactorNgamma,
} from "./tool.js";

describe("bearing-capacity-factor-ngamma", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBearingCapacityFactorNgamma(bearingCapacityFactorNgammaExample.input),
    ).toEqual({
      ok: true,
      output: bearingCapacityFactorNgammaExample.output,
    });
  });

  it("computes a representative medium-sand factor", () => {
    const result = runBearingCapacityFactorNgamma({ frictionAngleDeg: 35 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nGamma as number).toBe(48.028763586832795);
  });

  it("rejects a negative friction angle", () => {
    expect(runBearingCapacityFactorNgamma({ frictionAngleDeg: -10 }).ok).toBe(
      false,
    );
  });
});
