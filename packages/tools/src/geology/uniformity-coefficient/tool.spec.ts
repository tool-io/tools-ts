import { describe, expect, it } from "vitest";
import {
  uniformityCoefficientExample,
  runUniformityCoefficient,
} from "./tool.js";

describe("uniformity-coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUniformityCoefficient(uniformityCoefficientExample.input),
    ).toEqual({
      ok: true,
      output: uniformityCoefficientExample.output,
    });
  });

  it("returns one for perfectly uniform grain sizes", () => {
    const result = runUniformityCoefficient({ d60Mm: 0.5, d10Mm: 0.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.uniformityCoefficient as number).toBe(1);
  });

  it("rejects non-positive D10", () => {
    expect(runUniformityCoefficient({ d60Mm: 1, d10Mm: 0 }).ok).toBe(false);
  });
});
