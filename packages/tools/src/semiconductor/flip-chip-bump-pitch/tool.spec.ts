import { describe, expect, it } from "vitest";
import { flipChipBumpPitchExample, runFlipChipBumpPitch } from "./tool.js";

describe("Bump Density Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runFlipChipBumpPitch(flipChipBumpPitchExample.input)).toEqual({
      ok: true,
      output: { bumpsPerMm2: 44.44444444444444 },
    }));

  it("yields an integer density for a 250 um pitch", () =>
    expect(runFlipChipBumpPitch({ bumpPitchUm: 250 })).toEqual({
      ok: true,
      output: { bumpsPerMm2: 16 },
    }));

  it("yields 100 bumps per square millimeter at a 100 um pitch", () =>
    expect(runFlipChipBumpPitch({ bumpPitchUm: 100 })).toEqual({
      ok: true,
      output: { bumpsPerMm2: 100 },
    }));

  it("accepts fractional pitches", () =>
    expect(runFlipChipBumpPitch({ bumpPitchUm: 125.5 })).toEqual({
      ok: true,
      output: { bumpsPerMm2: 63.49105569752861 },
    }));

  it("rejects zero pitch with a stable code", () =>
    expect(runFlipChipBumpPitch({ bumpPitchUm: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bumpPitchUm" }] },
      ok: false,
    }));

  it("rejects negative pitch with a stable code", () =>
    expect(runFlipChipBumpPitch({ bumpPitchUm: -150 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bumpPitchUm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runFlipChipBumpPitch({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bumpPitchUm" }] },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(runFlipChipBumpPitch({ extra: 1 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
