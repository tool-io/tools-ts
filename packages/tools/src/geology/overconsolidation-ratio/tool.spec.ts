import { describe, expect, it } from "vitest";
import {
  overconsolidationRatioExample,
  runOverconsolidationRatio,
} from "./tool.js";

describe("overconsolidation-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOverconsolidationRatio(overconsolidationRatioExample.input),
    ).toEqual({
      ok: true,
      output: overconsolidationRatioExample.output,
    });
  });

  it("computes a lightly overconsolidated clay", () => {
    const result = runOverconsolidationRatio({
      preconsolidationPressureKpa: 150,
      effectiveOverburdenStressKpa: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.overconsolidationRatio as number).toBe(1.5);
    expect(result.output.consolidationState as string).toBe("overconsolidated");
  });

  it("rejects a non-positive overburden stress", () => {
    expect(
      runOverconsolidationRatio({
        preconsolidationPressureKpa: 200,
        effectiveOverburdenStressKpa: 0,
      }).ok,
    ).toBe(false);
  });
});
