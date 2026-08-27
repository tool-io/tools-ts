import { describe, expect, it } from "vitest";
import { specificGravityExample, runSpecificGravity } from "./tool.js";

describe("specific-gravity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSpecificGravity(specificGravityExample.input)).toEqual({
      ok: true,
      output: specificGravityExample.output,
    });
  });

  it("defaults to a reference water density of 1000 kg/m3", () => {
    const result = runSpecificGravity({ solidDensityKgPerM3: 2700 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.specificGravity as number).toBe(2.7);
  });
  it("rejects non-positive solid densities", () => {
    expect(runSpecificGravity({ solidDensityKgPerM3: 0 }).ok).toBe(false);
  });
});
