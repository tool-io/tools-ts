import { describe, expect, it } from "vitest";
import { pao2Fio2RatioExample, runPao2Fio2Ratio } from "./tool.js";

describe("P/F Ratio", () => {
  it("publishes an executable example", () =>
    expect(runPao2Fio2Ratio(pao2Fio2RatioExample.input)).toEqual({
      ok: true,
      output: pao2Fio2RatioExample.output,
    }));
  it("computes a severe impairment ratio", () =>
    expect(runPao2Fio2Ratio({ fiO2Fraction: 0.9, pao2Mmhg: 63 })).toEqual({
      ok: true,
      output: { pfRatio: 70 },
    }));
  it("keeps fractional precision", () =>
    expect(runPao2Fio2Ratio({ fiO2Fraction: 0.6, pao2Mmhg: 100 })).toEqual({
      ok: true,
      output: { pfRatio: 166.66666666666669 },
    }));
  it("supports room-air style fractions near zero", () =>
    expect(runPao2Fio2Ratio({ fiO2Fraction: 0.21, pao2Mmhg: 105 })).toEqual({
      ok: true,
      output: { pfRatio: 500 },
    }));
  it("rejects zero PaO2", () => {
    const result = runPao2Fio2Ratio({ fiO2Fraction: 0.4, pao2Mmhg: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("pao2Mmhg");
  });
  it("rejects zero FiO2", () => {
    const result = runPao2Fio2Ratio({ fiO2Fraction: 0, pao2Mmhg: 95 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("fiO2Fraction");
  });
  it("rejects unitary FiO2", () => {
    const result = runPao2Fio2Ratio({ fiO2Fraction: 1, pao2Mmhg: 95 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("fiO2Fraction");
  });
  it("rejects FiO2 above one", () => {
    const result = runPao2Fio2Ratio({ fiO2Fraction: 1.5, pao2Mmhg: 95 });
    expect(result.ok).toBe(false);
  });
});
