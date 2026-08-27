import { describe, expect, it } from "vitest";
import {
  bearingCapacityFactorNcExample,
  runBearingCapacityFactorNc,
} from "./tool.js";

describe("bearing-capacity-factor-nc", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBearingCapacityFactorNc(bearingCapacityFactorNcExample.input),
    ).toEqual({
      ok: true,
      output: bearingCapacityFactorNcExample.output,
    });
  });

  it("computes a representative low-friction factor", () => {
    const result = runBearingCapacityFactorNc({ frictionAngleDeg: 20 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nc as number).toBe(14.834711777931204);
  });

  it("rejects a negative friction angle", () => {
    expect(runBearingCapacityFactorNc({ frictionAngleDeg: -5 }).ok).toBe(false);
  });
});
