import { describe, expect, it } from "vitest";
import { effectiveStressExample, runEffectiveStress } from "./tool.js";

describe("effective-stress", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEffectiveStress(effectiveStressExample.input)).toEqual({
      ok: true,
      output: effectiveStressExample.output,
    });
  });

  it("equals the total stress under zero pore pressure", () => {
    const result = runEffectiveStress({
      porePressureKpa: 0,
      totalStressKpa: 400,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.effectiveStressKpa as number).toBe(400);
  });
  it("rejects negative stresses", () => {
    expect(
      runEffectiveStress({ porePressureKpa: -5, totalStressKpa: 250 }).ok,
    ).toBe(false);
  });
});
