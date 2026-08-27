import { describe, expect, it } from "vitest";
import { clinoformHeightExample, runClinoformHeight } from "./tool.js";

describe("clinoform-height", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runClinoformHeight(clinoformHeightExample.input)).toEqual({
      ok: true,
      output: clinoformHeightExample.output,
    });
  });

  it("equals the slope length for a vertical foreset", () => {
    const result = runClinoformHeight({
      clinoformLengthM: 800,
      foresetDipDeg: 90,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.clinoformHeightM as number).toBe(800);
  });

  it("rejects negative lengths and non-positive dips", () => {
    expect(
      runClinoformHeight({ clinoformLengthM: -10, foresetDipDeg: 3 }).ok,
    ).toBe(false);
    expect(
      runClinoformHeight({ clinoformLengthM: 100, foresetDipDeg: 0 }).ok,
    ).toBe(false);
  });
});
