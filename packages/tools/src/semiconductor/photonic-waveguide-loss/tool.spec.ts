import { describe, expect, it } from "vitest";
import { runWaveguideLoss, waveguideLossExample } from "./tool.js";

describe("Waveguide Loss Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runWaveguideLoss(waveguideLossExample.input)).toEqual({
      ok: true,
      output: { totalLossDb: 2 },
    }));

  it("returns zero loss for a zero-length waveguide at the boundary", () =>
    expect(runWaveguideLoss({ lengthCm: 0, lossDbPerCm: 0.5 })).toEqual({
      ok: true,
      output: { totalLossDb: 0 },
    }));

  it("returns zero loss for a lossless guide at the boundary", () =>
    expect(runWaveguideLoss({ lengthCm: 4, lossDbPerCm: 0 })).toEqual({
      ok: true,
      output: { totalLossDb: 0 },
    }));

  it("scales linearly with length", () =>
    expect(runWaveguideLoss({ lengthCm: 8, lossDbPerCm: 0.5 })).toEqual({
      ok: true,
      output: { totalLossDb: 4 },
    }));

  it("handles fractional attenuation", () =>
    expect(runWaveguideLoss({ lengthCm: 10, lossDbPerCm: 0.3 })).toEqual({
      ok: true,
      output: { totalLossDb: 3 },
    }));

  it("rejects negative attenuation with a stable code", () =>
    expect(
      runWaveguideLoss({ ...waveguideLossExample.input, lossDbPerCm: -0.5 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "lossDbPerCm" }],
      },
      ok: false,
    }));

  it("rejects negative length with a stable code", () =>
    expect(
      runWaveguideLoss({ ...waveguideLossExample.input, lengthCm: -4 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthCm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runWaveguideLoss({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthCm" }] },
      ok: false,
    }));
});
