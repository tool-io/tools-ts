import { describe, expect, it } from "vitest";
import { oilDensityExample, runOilDensity } from "./tool.js";

describe("oil-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOilDensity(oilDensityExample.input)).toEqual({
      ok: true,
      output: oilDensityExample.output,
    });
  });

  it("maps 10 API oil onto unity specific gravity", () => {
    const result = runOilDensity({ apiGravity: 10 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.specificGravity).toBe(1);
    expect(result.output.densityKgPerCubicMetre).toBe(1000);
  });

  it("rejects API gravity at or below the singularity", () => {
    expect(runOilDensity({ apiGravity: -131.5 }).ok).toBe(false);
  });
});
