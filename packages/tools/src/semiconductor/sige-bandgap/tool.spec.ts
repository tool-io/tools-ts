import { describe, expect, it } from "vitest";
import { sigeBandgapExample, runSigeBandgap } from "./tool.js";

const bandgapOf = (result: ReturnType<typeof runSigeBandgap>): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.bandgapEv;
  if (typeof value !== "number") throw new Error("Expected numeric band gap.");
  return value;
};

describe("SiGe Bandgap Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSigeBandgap(sigeBandgapExample.input)).toEqual({
      ok: true,
      output: { bandgapEv: 1.0383200000000001 },
    }));

  it("returns the silicon band gap at x = 0", () =>
    expect(runSigeBandgap({ germaniumFractionX: 0 })).toEqual({
      ok: true,
      output: { bandgapEv: 1.12 },
    }));

  it("returns the relaxed GeSi endpoint at x = 1", () =>
    expect(runSigeBandgap({ germaniumFractionX: 1 })).toEqual({
      ok: true,
      output: { bandgapEv: 0.6600000000000001 },
    }));

  it("evaluates the quadratic at the midpoint", () =>
    expect(runSigeBandgap({ germaniumFractionX: 0.5 })).toEqual({
      ok: true,
      output: { bandgapEv: 0.9170000000000001 },
    }));

  it("accepts a typical heterojunction composition", () =>
    expect(runSigeBandgap({ germaniumFractionX: 0.75 })).toEqual({
      ok: true,
      output: { bandgapEv: 0.8170000000000001 },
    }));

  it("lowers the band gap as the germanium fraction rises", () => {
    const low = runSigeBandgap({ germaniumFractionX: 0.1 });
    const high = runSigeBandgap({ germaniumFractionX: 0.6 });
    expect(low).toMatchObject({ ok: true });
    expect(high).toMatchObject({ ok: true });
    expect(bandgapOf(high)).toBeLessThan(bandgapOf(low));
  });

  it("rejects a fraction below the valid range", () =>
    expect(runSigeBandgap({ germaniumFractionX: -0.01 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a fraction above the valid range", () =>
    expect(runSigeBandgap({ germaniumFractionX: 1.01 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a non-finite fraction", () =>
    expect(runSigeBandgap({ germaniumFractionX: Number.NaN })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a missing fraction", () =>
    expect(runSigeBandgap({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(runSigeBandgap({ germaniumFractionX: 0.2, extra: 1 })).toMatchObject(
      {
        error: { issues: [{ code: "unknown_field", field: "extra" }] },
        ok: false,
      },
    ));
});
