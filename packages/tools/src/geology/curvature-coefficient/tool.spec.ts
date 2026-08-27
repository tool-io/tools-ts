import { describe, expect, it } from "vitest";
import {
  curvatureCoefficientExample,
  runCurvatureCoefficient,
} from "./tool.js";

describe("curvature-coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCurvatureCoefficient(curvatureCoefficientExample.input)).toEqual({
      ok: true,
      output: curvatureCoefficientExample.output,
    });
  });

  it("returns one for equally spaced gradation sizes", () => {
    const result = runCurvatureCoefficient({
      d30Mm: 0.4,
      d60Mm: 0.8,
      d10Mm: 0.2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.curvatureCoefficient as number).toBe(1);
  });

  it("rejects non-positive grain sizes", () => {
    expect(runCurvatureCoefficient({ d30Mm: -1, d60Mm: 1, d10Mm: 1 }).ok).toBe(
      false,
    );
  });
});
