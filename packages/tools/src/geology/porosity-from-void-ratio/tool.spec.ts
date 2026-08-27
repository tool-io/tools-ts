import { describe, expect, it } from "vitest";
import {
  porosityFromVoidRatioExample,
  runPorosityFromVoidRatio,
} from "./tool.js";

describe("porosity-from-void-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPorosityFromVoidRatio(porosityFromVoidRatioExample.input),
    ).toEqual({
      ok: true,
      output: porosityFromVoidRatioExample.output,
    });
  });

  it("returns zero for zero void ratio", () => {
    const result = runPorosityFromVoidRatio({ voidRatio: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porosityFraction as number).toBe(0);
  });
  it("rejects negative void ratios", () => {
    expect(runPorosityFromVoidRatio({ voidRatio: -0.5 }).ok).toBe(false);
  });
});
