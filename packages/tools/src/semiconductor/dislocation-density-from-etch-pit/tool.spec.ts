import { describe, expect, it } from "vitest";
import {
  calculateDislocationDensityFromEtchPit,
  dislocationDensityFromEtchPitExample,
  runDislocationDensityFromEtchPit,
} from "./tool.js";
import type { DislocationDensityFromEtchPitOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDislocationDensityFromEtchPit>,
): DislocationDensityFromEtchPitOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as DislocationDensityFromEtchPitOutput;
};

describe("Dislocation Density from Etch Pits", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDislocationDensityFromEtchPit(
        dislocationDensityFromEtchPitExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dislocationDensityFromEtchPitExample.output,
    });
    expect(
      calculateDislocationDensityFromEtchPit(
        dislocationDensityFromEtchPitExample.input,
      ).dislocationDensityPerCm2,
    ).toBe(40000000);
  });

  it("converts one pit on one square micrometer and large count", () => {
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 1, fieldAreaUm2: 1 }),
    ).toEqual({
      ok: true,
      output: { dislocationDensityPerCm2: 100000000 },
    });
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 2500, fieldAreaUm2: 50 }),
    ).toEqual({
      ok: true,
      output: { dislocationDensityPerCm2: 5000000000 },
    });
    expect(
      calculateDislocationDensityFromEtchPit({ pitCount: 1, fieldAreaUm2: 1 })
        .dislocationDensityPerCm2,
    ).toBe(100000000);
  });

  it("returns zero density for zero pits and normalizes -0", () => {
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 0, fieldAreaUm2: 250 }),
    ).toEqual({
      ok: true,
      output: { dislocationDensityPerCm2: 0 },
    });
    const viaCalc = calculateDislocationDensityFromEtchPit({
      pitCount: 0,
      fieldAreaUm2: 250,
    }).dislocationDensityPerCm2;
    expect(viaCalc).toBe(0);
    expect(Object.is(viaCalc, -0)).toBe(false);
    const minusZero = calculateDislocationDensityFromEtchPit({
      pitCount: -0,
      fieldAreaUm2: 250,
    }).dislocationDensityPerCm2;
    expect(Object.is(minusZero, -0)).toBe(false);
    expect(
      outputOf(
        runDislocationDensityFromEtchPit({ pitCount: -0, fieldAreaUm2: 250 }),
      ).dislocationDensityPerCm2,
    ).toBe(0);
  });

  it("is proportional to pit count and inverse with area", () => {
    const single = outputOf(
      runDislocationDensityFromEtchPit({ pitCount: 12, fieldAreaUm2: 30 }),
    ).dislocationDensityPerCm2;
    const triple = outputOf(
      runDislocationDensityFromEtchPit({ pitCount: 36, fieldAreaUm2: 30 }),
    ).dislocationDensityPerCm2;
    expect(single).toBe(40000000);
    expect(triple).toBe(120000000);
    expect(triple).toBeCloseTo(single * 3, 12);
    const doubledArea = outputOf(
      runDislocationDensityFromEtchPit({ pitCount: 12, fieldAreaUm2: 60 }),
    ).dislocationDensityPerCm2;
    expect(doubledArea).toBeCloseTo(single / 2, 12);
  });

  it("rejects missing required inputs", () => {
    expect(runDislocationDensityFromEtchPit({} as never).ok).toBe(false);
    expect(runDislocationDensityFromEtchPit({ pitCount: 10 } as never).ok).toBe(
      false,
    );
    expect(
      runDislocationDensityFromEtchPit({ fieldAreaUm2: 10 } as never).ok,
    ).toBe(false);
    if (!runDislocationDensityFromEtchPit({} as never).ok)
      expect(
        runDislocationDensityFromEtchPit({} as never).error.issues[0].code,
      ).toBe("invalid_field");
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDislocationDensityFromEtchPit({
        pitCount: "10" as never,
        fieldAreaUm2: 250,
      }).ok,
    ).toBe(false);
    expect(
      runDislocationDensityFromEtchPit({
        pitCount: 10,
        fieldAreaUm2: "250" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDislocationDensityFromEtchPit({
        pitCount: "10" as unknown as number,
        fieldAreaUm2: 250,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unk = runDislocationDensityFromEtchPit({
      pitCount: 1,
      fieldAreaUm2: 1,
      extra: true,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runDislocationDensityFromEtchPit(null as never).ok).toBe(false);
    if (!runDislocationDensityFromEtchPit(null as never).ok)
      expect(
        runDislocationDensityFromEtchPit(null as never).error.issues[0].code,
      ).toBe("object_required");
    expect(runDislocationDensityFromEtchPit([] as never).ok).toBe(false);
    expect(runDislocationDensityFromEtchPit(42 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDislocationDensityFromEtchPit({ pitCount: bad, fieldAreaUm2: 250 })
          .ok,
      ).toBe(false);
      expect(
        runDislocationDensityFromEtchPit({ pitCount: 10, fieldAreaUm2: bad })
          .ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDislocationDensityFromEtchPit>[0];
      field: string;
    }> = [
      { input: { pitCount: Number.NaN, fieldAreaUm2: 250 }, field: "pitCount" },
      {
        input: { pitCount: Number.POSITIVE_INFINITY, fieldAreaUm2: 250 },
        field: "pitCount",
      },
      {
        input: { pitCount: 10, fieldAreaUm2: Number.NaN },
        field: "fieldAreaUm2",
      },
      {
        input: { pitCount: 10, fieldAreaUm2: Number.POSITIVE_INFINITY },
        field: "fieldAreaUm2",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDislocationDensityFromEtchPit(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: negative or fractional pit count, zero/negative area", () => {
    expect(
      runDislocationDensityFromEtchPit({ pitCount: -1, fieldAreaUm2: 250 }).ok,
    ).toBe(false);
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 1.5, fieldAreaUm2: 250 }).ok,
    ).toBe(false);
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 10, fieldAreaUm2: 0 }).ok,
    ).toBe(false);
    expect(
      runDislocationDensityFromEtchPit({ pitCount: 10, fieldAreaUm2: -5 }).ok,
    ).toBe(false);
    // direct codes
    let err: unknown = null;
    try {
      calculateDislocationDensityFromEtchPit({
        pitCount: 1.5,
        fieldAreaUm2: 250,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("pitCount");
    err = null;
    try {
      calculateDislocationDensityFromEtchPit({
        pitCount: -1,
        fieldAreaUm2: 250,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("pitCount");
    err = null;
    try {
      calculateDislocationDensityFromEtchPit({ pitCount: 10, fieldAreaUm2: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("fieldAreaUm2");
  });

  it("direct calculator mirrors runner for valid and invalid", () => {
    expect(
      calculateDislocationDensityFromEtchPit({
        pitCount: 100,
        fieldAreaUm2: 250,
      }).dislocationDensityPerCm2,
    ).toBe(40000000);
    expect(() =>
      calculateDislocationDensityFromEtchPit({
        pitCount: -1,
        fieldAreaUm2: 250,
      }),
    ).toThrow();
    expect(() =>
      calculateDislocationDensityFromEtchPit({
        pitCount: Number.NaN,
        fieldAreaUm2: 250,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runDislocationDensityFromEtchPit({ pitCount: 100, fieldAreaUm2: 250 }),
    ).dislocationDensityPerCm2;
    const direct = calculateDislocationDensityFromEtchPit({
      pitCount: 100,
      fieldAreaUm2: 250,
    }).dislocationDensityPerCm2;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: linear with count, inverse with area, monotonic and recovery", () => {
    const base = calculateDislocationDensityFromEtchPit({
      pitCount: 10,
      fieldAreaUm2: 10,
    }).dislocationDensityPerCm2;
    expect(base).toBe(100000000);
    const doubledCount = calculateDislocationDensityFromEtchPit({
      pitCount: 20,
      fieldAreaUm2: 10,
    }).dislocationDensityPerCm2;
    expect(doubledCount).toBeCloseTo(base * 2, 12);
    const halvedArea = calculateDislocationDensityFromEtchPit({
      pitCount: 10,
      fieldAreaUm2: 5,
    }).dislocationDensityPerCm2;
    expect(halvedArea).toBeCloseTo(base * 2, 12);
    // inverse: count = D * A *1e-8
    const recoveredCount = base * 10 * 1e-8;
    expect(recoveredCount).toBeCloseTo(10, 12);
    // monotonic
    const low = calculateDislocationDensityFromEtchPit({
      pitCount: 5,
      fieldAreaUm2: 100,
    }).dislocationDensityPerCm2;
    const high = calculateDislocationDensityFromEtchPit({
      pitCount: 100,
      fieldAreaUm2: 10,
    }).dislocationDensityPerCm2;
    expect(high).toBeGreaterThan(low);
  });

  it("handles extremes and overflow", () => {
    // test with moderate huge values that remain finite
    const huge = calculateDislocationDensityFromEtchPit({
      pitCount: Number.MAX_SAFE_INTEGER,
      fieldAreaUm2: 1e-6,
    });
    expect(Number.isFinite(huge.dislocationDensityPerCm2)).toBe(true);
    expect(huge.dislocationDensityPerCm2).toBeGreaterThan(0);
    expect(Object.is(huge.dislocationDensityPerCm2, -0)).toBe(false);

    // extreme small area that underflows areaCm2 to 0 => numeric_overflow
    let err: unknown = null;
    try {
      calculateDislocationDensityFromEtchPit({
        pitCount: Number.MAX_SAFE_INTEGER,
        fieldAreaUm2: Number.MIN_VALUE,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect((err as { code: string }).code).toBe("numeric_overflow");
    expect((err as { field: string }).field).toBe("fieldAreaUm2");

    // another extreme: 1e-308 leads to overflow or huge finite - check runner
    const runnerOverflow = runDislocationDensityFromEtchPit({
      pitCount: Number.MAX_SAFE_INTEGER,
      fieldAreaUm2: Number.MIN_VALUE,
    });
    expect(runnerOverflow.ok).toBe(false);
    if (!runnerOverflow.ok)
      expect(runnerOverflow.error.issues[0].code).toBe("numeric_overflow");
  });
});
