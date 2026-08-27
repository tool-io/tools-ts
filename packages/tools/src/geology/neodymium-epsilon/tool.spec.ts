import { describe, expect, it } from "vitest";
import { neodymiumEpsilonExample, runNeodymiumEpsilon } from "./tool.js";

describe("neodymium-epsilon", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNeodymiumEpsilon(neodymiumEpsilonExample.input)).toEqual({
      ok: true,
      output: neodymiumEpsilonExample.output,
    });
  });

  it("defaults to the Jacobsen-Wasserburg CHUR value", () => {
    const result = runNeodymiumEpsilon({ nd143nd144: 0.511 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.epsilonNd as number).toBeCloseTo(
      -31.952371849142125,
      12,
    );
  });

  it("rejects non-positive ratios", () => {
    expect(runNeodymiumEpsilon({ nd143nd144: 0 }).ok).toBe(false);
  });
});
