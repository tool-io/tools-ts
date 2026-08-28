import { describe, expect, it } from "vitest";
import { noiseFigureLinearExample, runNoiseFigureLinear } from "./tool.js";

describe("Factor To Noise Figure", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNoiseFigureLinear(noiseFigureLinearExample.input)).toEqual({
      ok: true,
      output: { noiseFigureDb: 3.010299956639812 },
    }));
  it("reports 0 dB for a unity factor", () =>
    expect(runNoiseFigureLinear({ noiseFactor: 1 })).toEqual({
      ok: true,
      output: { noiseFigureDb: 0 },
    }));
  it("reports 10 dB for a factor of ten", () =>
    expect(runNoiseFigureLinear({ noiseFactor: 10 })).toEqual({
      ok: true,
      output: { noiseFigureDb: 10 },
    }));
  it("guards below-unity factors with a dedicated code", () =>
    expect(runNoiseFigureLinear({ noiseFactor: 0.5 })).toMatchObject({
      error: {
        issues: [{ code: "below_unity", field: "noiseFactor" }],
      },
      ok: false,
    }));
  it("rejects boundary values just under unity", () =>
    expect(runNoiseFigureLinear({ noiseFactor: 0.99 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(runNoiseFigureLinear({ noiseFactor: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFactor" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNoiseFigureLinear({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFactor" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNoiseFigureLinear({
        ...noiseFigureLinearExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
