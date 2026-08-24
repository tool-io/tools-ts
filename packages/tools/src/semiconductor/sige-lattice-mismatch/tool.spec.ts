import { describe, expect, it } from "vitest";
import { sigeLatticeMismatchExample, runSigeLatticeMismatch } from "./tool.js";

const mismatchOf = (
  result: ReturnType<typeof runSigeLatticeMismatch>,
): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.mismatchFraction;
  if (typeof value !== "number") throw new Error("Expected numeric mismatch.");
  return value;
};

describe("SiGe Lattice Mismatch Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSigeLatticeMismatch(sigeLatticeMismatchExample.input)).toEqual({
      ok: true,
      output: { mismatchFraction: 0.008359418155035917 },
    }));

  it("reports zero mismatch for pure silicon", () =>
    expect(runSigeLatticeMismatch({ germaniumFractionX: 0 })).toEqual({
      ok: true,
      output: { mismatchFraction: 0 },
    }));

  it("reports the full SiGe mismatch at x = 1", () =>
    expect(runSigeLatticeMismatch({ germaniumFractionX: 1 })).toEqual({
      ok: true,
      output: { mismatchFraction: 0.04179709077517958 },
    }));

  it("evaluates a dilute composition", () =>
    expect(runSigeLatticeMismatch({ germaniumFractionX: 0.1 })).toEqual({
      ok: true,
      output: { mismatchFraction: 0.004179709077517958 },
    }));

  it("is exactly linear in the germanium fraction", () => {
    const half = runSigeLatticeMismatch({ germaniumFractionX: 0.4 });
    const quarter = runSigeLatticeMismatch({ germaniumFractionX: 0.2 });
    expect(half).toMatchObject({ ok: true });
    expect(quarter).toMatchObject({ ok: true });
    expect(mismatchOf(half)).toBe(2 * mismatchOf(quarter));
  });

  it("yields positive mismatch above pure silicon", () => {
    const result = runSigeLatticeMismatch({ germaniumFractionX: 0.5 });
    expect(result).toMatchObject({ ok: true });
    expect(mismatchOf(result)).toBeGreaterThan(0);
  });

  it("rejects a fraction below the valid range", () =>
    expect(runSigeLatticeMismatch({ germaniumFractionX: -0.01 })).toMatchObject(
      {
        error: {
          issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
        },
        ok: false,
      },
    ));

  it("rejects a fraction above the valid range", () =>
    expect(runSigeLatticeMismatch({ germaniumFractionX: 1.5 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a non-finite fraction", () =>
    expect(
      runSigeLatticeMismatch({ germaniumFractionX: Number.NEGATIVE_INFINITY }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects a missing fraction", () =>
    expect(runSigeLatticeMismatch({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "germaniumFractionX" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSigeLatticeMismatch({ germaniumFractionX: 0.2, extra: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
