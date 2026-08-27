import { describe, expect, it } from "vitest";
import {
  decompactedThicknessExample,
  runDecompactedThickness,
} from "./tool.js";

describe("decompacted-thickness", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecompactedThickness(decompactedThicknessExample.input)).toEqual({
      ok: true,
      output: decompactedThicknessExample.output,
    });
  });

  it("defaults the target porosity to zero", () => {
    const result = runDecompactedThickness({
      compactedThicknessM: 600,
      porosityFraction: 0.25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.decompactedThicknessM as number).toBe(450);
  });

  it("rejects negative thickness and out-of-range porosities", () => {
    expect(
      runDecompactedThickness({
        compactedThicknessM: -1,
        porosityFraction: 0.3,
      }).ok,
    ).toBe(false);
    expect(
      runDecompactedThickness({ compactedThicknessM: 100, porosityFraction: 1 })
        .ok,
    ).toBe(false);
    expect(
      runDecompactedThickness({
        compactedThicknessM: 100,
        porosityFraction: 0.3,
        targetPorosityFraction: 1.2,
      }).ok,
    ).toBe(false);
  });
});
