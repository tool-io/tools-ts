import { describe, expect, it } from "vitest";
import { flexuralRigidityExample, runFlexuralRigidity } from "./tool.js";

describe("flexural-rigidity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlexuralRigidity(flexuralRigidityExample.input)).toEqual({
      ok: true,
      output: flexuralRigidityExample.output,
    });
  });

  it("scales with the cube of elastic thickness", () => {
    const result = runFlexuralRigidity({ elasticThicknessM: 50000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.flexuralRigidityNm as number).toBe(
      9.722222222222222e22 * 8,
    );
  });

  it("rejects non-positive thickness and out-of-range ratios", () => {
    expect(runFlexuralRigidity({ elasticThicknessM: 0 }).ok).toBe(false);
    expect(
      runFlexuralRigidity({ elasticThicknessM: 10000, poissonsRatio: 1 }).ok,
    ).toBe(false);
  });
});
