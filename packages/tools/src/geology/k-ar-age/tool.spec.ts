import { describe, expect, it } from "vitest";
import { kaArAgeExample, runKArAge } from "./tool.js";

describe("k-ar-age", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runKArAge(kaArAgeExample.input)).toEqual({
      ok: true,
      output: kaArAgeExample.output,
    });
  });

  it("returns zero age for argon-free sample", () => {
    const result = runKArAge({ argon40Radiogenic: 0, potassium40: 5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ageYears as number).toBe(0);
  });

  it("rejects non-positive potassium", () => {
    expect(runKArAge({ argon40Radiogenic: 1, potassium40: 0 }).ok).toBe(false);
  });
});
