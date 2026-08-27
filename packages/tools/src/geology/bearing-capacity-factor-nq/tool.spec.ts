import { describe, expect, it } from "vitest";
import {
  bearingCapacityFactorNqExample,
  runBearingCapacityFactorNq,
} from "./tool.js";

describe("bearing-capacity-factor-nq", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBearingCapacityFactorNq(bearingCapacityFactorNqExample.input),
    ).toEqual({
      ok: true,
      output: bearingCapacityFactorNqExample.output,
    });
  });

  it("computes a representative dense-sand factor", () => {
    const result = runBearingCapacityFactorNq({ frictionAngleDeg: 45 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.nq as number).toBe(134.87384062630494);
  });

  it("rejects a friction angle of 90 degrees or more", () => {
    expect(runBearingCapacityFactorNq({ frictionAngleDeg: 90 }).ok).toBe(false);
  });
});
