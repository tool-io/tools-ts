import { describe, expect, it } from "vitest";
import {
  cementCompressiveStrengthExample,
  runCementCompressiveStrength,
} from "./tool.js";

describe("geology/cement-compressive-strength", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCementCompressiveStrength(cementCompressiveStrengthExample.input),
    ).toEqual({
      ok: true,
      output: cementCompressiveStrengthExample.output,
    });
  });

  it("doubles the strength when the load doubles", () => {
    const base = runCementCompressiveStrength({
      failureLoadKilonewtons: 50,
      cubeSideMillimetres: 50,
    });
    const double = runCementCompressiveStrength({
      failureLoadKilonewtons: 100,
      cubeSideMillimetres: 50,
    });
    expect(base.ok && double.ok).toBe(true);
    if (base.ok && double.ok)
      expect(double.output.compressiveStrengthMegapascals as number).toBe(
        (base.output.compressiveStrengthMegapascals as number) * 2,
      );
  });

  it("rejects non-positive load and specimen size", () => {
    expect(
      runCementCompressiveStrength({
        failureLoadKilonewtons: 0,
        cubeSideMillimetres: 50,
      }).ok,
    ).toBe(false);
    expect(
      runCementCompressiveStrength({
        failureLoadKilonewtons: 50,
        cubeSideMillimetres: 0,
      }).ok,
    ).toBe(false);
  });
});
