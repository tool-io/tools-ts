import { describe, expect, it } from "vitest";
import {
  voidRatioFromPorosityExample,
  runVoidRatioFromPorosity,
} from "./tool.js";

describe("void-ratio-from-porosity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVoidRatioFromPorosity(voidRatioFromPorosityExample.input),
    ).toEqual({
      ok: true,
      output: voidRatioFromPorosityExample.output,
    });
  });

  it("returns zero for zero porosity", () => {
    const result = runVoidRatioFromPorosity({ porosityFraction: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.voidRatio as number).toBe(0);
  });
  it("rejects porosity of one or more", () => {
    expect(runVoidRatioFromPorosity({ porosityFraction: 1 }).ok).toBe(false);
  });
});
