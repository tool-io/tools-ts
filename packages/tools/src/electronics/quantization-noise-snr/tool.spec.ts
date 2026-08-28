import { describe, expect, it } from "vitest";
import {
  quantizationNoiseSnrExample,
  runQuantizationNoiseSnr,
} from "./tool.js";

describe("Quantization SNR", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runQuantizationNoiseSnr(quantizationNoiseSnrExample.input)).toEqual({
      ok: true,
      output: { quantizationSnrDb: 98.08 },
    }));
  it("reports the one-bit floor", () =>
    expect(runQuantizationNoiseSnr({ bits: 1 })).toEqual({
      ok: true,
      output: { quantizationSnrDb: 7.779999999999999 },
    }));
  it("reports the thirty-two bit ceiling", () =>
    expect(runQuantizationNoiseSnr({ bits: 32 })).toEqual({
      ok: true,
      output: { quantizationSnrDb: 194.39999999999998 },
    }));
  it("rejects bits below the supported range", () =>
    expect(runQuantizationNoiseSnr({ bits: 0 }).ok).toBe(false));
  it("rejects bits above the supported range", () =>
    expect(runQuantizationNoiseSnr({ bits: 33 }).ok).toBe(false));
  it("rejects fractional bit depths", () =>
    expect(runQuantizationNoiseSnr({ bits: 1.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bits" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runQuantizationNoiseSnr({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bits" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runQuantizationNoiseSnr({
        ...quantizationNoiseSnrExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
