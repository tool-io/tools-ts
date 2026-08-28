import { describe, expect, it } from "vitest";
import { noiseFigureDbExample, runNoiseFigureDb } from "./tool.js";

describe("Noise Figure To Factor", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNoiseFigureDb(noiseFigureDbExample.input)).toEqual({
      ok: true,
      output: { noiseFactor: 1.9952623149688795 },
    }));
  it("reports unity factor for a 0 dB figure", () =>
    expect(runNoiseFigureDb({ noiseFigureDb: 0 })).toEqual({
      ok: true,
      output: { noiseFactor: 1 },
    }));
  it("reports a factor of ten for a 10 dB figure", () =>
    expect(runNoiseFigureDb({ noiseFigureDb: 10 })).toEqual({
      ok: true,
      output: { noiseFactor: 10 },
    }));
  it("reports large factors for high noise figures", () =>
    expect(runNoiseFigureDb({ noiseFigureDb: 30 })).toEqual({
      ok: true,
      output: { noiseFactor: 1000 },
    }));
  it("rejects non-finite input", () =>
    expect(runNoiseFigureDb({ noiseFigureDb: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFigureDb" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNoiseFigureDb({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFigureDb" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNoiseFigureDb({ ...noiseFigureDbExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
