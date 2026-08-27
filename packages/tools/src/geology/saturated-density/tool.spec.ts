import { describe, expect, it } from "vitest";
import { saturatedDensityExample, runSaturatedDensity } from "./tool.js";

describe("saturated-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSaturatedDensity(saturatedDensityExample.input)).toEqual({
      ok: true,
      output: saturatedDensityExample.output,
    });
  });

  it("reduces to Gs times water density at zero void ratio", () => {
    const result = runSaturatedDensity({ specificGravity: 2.65, voidRatio: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.saturatedDensityKgPerM3 as number).toBe(2650);
  });
  it("rejects negative void ratios", () => {
    expect(runSaturatedDensity({ voidRatio: -1 }).ok).toBe(false);
  });
});
