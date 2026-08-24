import { describe, expect, it } from "vitest";
import {
  calculateCoulombBlockadeVoltage,
  coulombBlockadeVoltageExample,
  runCoulombBlockadeVoltage,
} from "./tool.js";
import type { CoulombBlockadeVoltageOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runCoulombBlockadeVoltage>,
): CoulombBlockadeVoltageOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as CoulombBlockadeVoltageOutput;
};

describe("Coulomb Blockade Voltage Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCoulombBlockadeVoltage(coulombBlockadeVoltageExample.input),
    ).toEqual({ ok: true, output: coulombBlockadeVoltageExample.output });
    expect(
      calculateCoulombBlockadeVoltage(coulombBlockadeVoltageExample.input)
        .blockadeMillivolts,
    ).toBe(80.108832);
  });

  it("gives the verified eighty point one millivolt scale at one femtofarad via runner and direct", () => {
    const result = runCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.blockadeMillivolts).toBeCloseTo(80.1, 1);
    expect(
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 1 })
        .blockadeMillivolts,
    ).toBeCloseTo(80.108832, 12);
  });

  it("halves the blockade when capacitance doubles", () => {
    expect(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 2 }),
    ).toEqual({ ok: true, output: { blockadeMillivolts: 40.054416 } });
    expect(
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 2 })
        .blockadeMillivolts,
    ).toBe(40.054416);
  });

  it("doubles the blockade when capacitance halves", () => {
    expect(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 0.5 }),
    ).toEqual({ ok: true, output: { blockadeMillivolts: 160.217664 } });
    expect(
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 0.5 })
        .blockadeMillivolts,
    ).toBe(160.217664);
  });

  it("scales inversely with capacitance at ten femtofarads", () => {
    expect(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 10 }),
    ).toEqual({ ok: true, output: { blockadeMillivolts: 8.0108832 } });
  });

  it("rejects missing capacitance", () => {
    expect(runCoulombBlockadeVoltage({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects wrong type capacitance", () => {
    expect(
      runCoulombBlockadeVoltage({
        totalCapacitanceFemtoFarads: "1" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateCoulombBlockadeVoltage({
        totalCapacitanceFemtoFarads: "1" as unknown as number,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    expect(
      runCoulombBlockadeVoltage({
        totalCapacitanceFemtoFarads: 1,
        extra: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });

  it("rejects non-object input", () => {
    expect(runCoulombBlockadeVoltage(null as never).ok).toBe(false);
    if (!runCoulombBlockadeVoltage(null as never).ok)
      expect(
        runCoulombBlockadeVoltage(null as never).error.issues[0].code,
      ).toBe("object_required");
    expect(runCoulombBlockadeVoltage([] as never).ok).toBe(false);
    expect(runCoulombBlockadeVoltage(1 as never).ok).toBe(false);
  });

  it("rejects non-finite capacitance via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: bad }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateCoulombBlockadeVoltage>[0];
      field: string;
    }> = [
      {
        input: { totalCapacitanceFemtoFarads: Number.NaN },
        field: "totalCapacitanceFemtoFarads",
      },
      {
        input: { totalCapacitanceFemtoFarads: Number.POSITIVE_INFINITY },
        field: "totalCapacitanceFemtoFarads",
      },
      {
        input: { totalCapacitanceFemtoFarads: Number.NEGATIVE_INFINITY },
        field: "totalCapacitanceFemtoFarads",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateCoulombBlockadeVoltage(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects zero and negative capacitance boundaries with field codes", () => {
    expect(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 0 }),
    ).toMatchObject({
      error: { issues: [{ field: "totalCapacitanceFemtoFarads" }] },
      ok: false,
    });
    expect(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: -1 }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_value");
    expect((err as { field: string }).field).toBe(
      "totalCapacitanceFemtoFarads",
    );

    err = null;
    try {
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: -5 });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_value");
  });

  it("direct calculator mirrors runner and checks field codes", () => {
    expect(
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 2 })
        .blockadeMillivolts,
    ).toBe(40.054416);
    expect(() =>
      calculateCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 0 }),
    ).toThrow();
    expect(() =>
      calculateCoulombBlockadeVoltage({
        totalCapacitanceFemtoFarads: Number.NaN,
      }),
    ).toThrow();
  });

  it("preserves inverse: C = 80.108832 / V and product constant", () => {
    const c = 2;
    const v = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: c,
    }).blockadeMillivolts;
    expect(v * c).toBeCloseTo(80.108832, 12);
    const recoveredC = 80.108832 / v;
    expect(recoveredC).toBeCloseTo(c, 12);

    const viaRunner = outputOf(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 10 }),
    ).blockadeMillivolts;
    expect(viaRunner * 10).toBeCloseTo(80.108832, 12);
  });

  it("is monotonic decreasing with capacitance", () => {
    const smallC = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: 0.5,
    }).blockadeMillivolts;
    const largeC = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: 10,
    }).blockadeMillivolts;
    expect(largeC).toBeLessThan(smallC);
    const mid = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: 2,
    }).blockadeMillivolts;
    expect(mid).toBeGreaterThan(largeC);
    expect(mid).toBeLessThan(smallC);
  });

  it("handles small and large capacitance without -0 and preserves full precision", () => {
    const tinyCap = 1e-300;
    const hugeV = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: tinyCap,
    }).blockadeMillivolts;
    expect(Number.isFinite(hugeV)).toBe(true);
    expect(Object.is(hugeV, -0)).toBe(false);

    const hugeCap = 1e6;
    const smallV = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: hugeCap,
    }).blockadeMillivolts;
    expect(smallV).toBeCloseTo(0.000080108832, 12);
    expect(Object.is(smallV, -0)).toBe(false);

    const direct = calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: 1,
    }).blockadeMillivolts;
    const viaRunner = outputOf(
      runCoulombBlockadeVoltage({ totalCapacitanceFemtoFarads: 1 }),
    ).blockadeMillivolts;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(80.108832);
    expect(direct.toString()).toBe("80.108832");
  });
});
