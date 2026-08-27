import { describe, expect, it } from "vitest";
import { arArAgeExample, runArArAge } from "./tool.js";

describe("ar-ar-age", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runArArAge(arArAgeExample.input)).toEqual({
      ok: true,
      output: arArAgeExample.output,
    });
  });

  it("returns zero age for a zero ratio", () => {
    const result = runArArAge({
      jFactor: 0.01,
      radiogenicArgon40OverArgon39: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ageYears as number).toBe(0);
  });

  it("rejects a non-positive J factor", () => {
    expect(runArArAge({ jFactor: 0, radiogenicArgon40OverArgon39: 1 }).ok).toBe(
      false,
    );
  });
});
