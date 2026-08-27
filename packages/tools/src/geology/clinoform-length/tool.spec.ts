import { describe, expect, it } from "vitest";
import { clinoformLengthExample, runClinoformLength } from "./tool.js";

describe("clinoform-length", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runClinoformLength(clinoformLengthExample.input)).toEqual({
      ok: true,
      output: clinoformLengthExample.output,
    });
  });

  it("equals the height for a vertical foreset", () => {
    const result = runClinoformLength({
      clinoformHeightM: 500,
      foresetDipDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.clinoformLengthM as number).toBe(500);
  });

  it("rejects negative heights and zero dips", () => {
    expect(
      runClinoformLength({ clinoformHeightM: -1, foresetDipDeg: 2 }).ok,
    ).toBe(false);
    expect(
      runClinoformLength({ clinoformHeightM: 100, foresetDipDeg: 0 }).ok,
    ).toBe(false);
  });
});
