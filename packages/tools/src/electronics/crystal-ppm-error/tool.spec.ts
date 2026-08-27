import { describe, expect, it } from "vitest";
import { runCrystalPpmError } from "./tool.js";
describe("Crystal PPM Error", () => {
  it("calculates a positive error", () =>
    expect(
      runCrystalPpmError({ measuredHz: 8000100, nominalHz: 8000000 }),
    ).toEqual({
      ok: true,
      output: { ppmError: 12.5 },
    }));
  it("calculates a negative error", () =>
    expect(
      runCrystalPpmError({ measuredHz: 7999960, nominalHz: 8000000 }),
    ).toEqual({
      ok: true,
      output: { ppmError: -5 },
    }));
  it("returns zero for an exact match", () =>
    expect(
      runCrystalPpmError({ measuredHz: 16000000, nominalHz: 16000000 }),
    ).toEqual({
      ok: true,
      output: { ppmError: 0 },
    }));
  it("supports sub-ppm resolution", () =>
    expect(
      runCrystalPpmError({ measuredHz: 1000001, nominalHz: 1000000 }),
    ).toEqual({
      ok: true,
      output: { ppmError: 1 },
    }));
  it("rejects a zero nominal frequency", () =>
    expect(runCrystalPpmError({ measuredHz: 8e6, nominalHz: 0 }).ok).toBe(
      false,
    ));
  it("rejects a negative nominal frequency", () =>
    expect(runCrystalPpmError({ measuredHz: 8e6, nominalHz: -8e6 }).ok).toBe(
      false,
    ));
  it("rejects a non-positive measured frequency", () =>
    expect(runCrystalPpmError({ measuredHz: 0, nominalHz: 8e6 }).ok).toBe(
      false,
    ));
});
