import { describe, expect, it } from "vitest";
import {
  calculatePunchThroughVoltage,
  punchThroughVoltageExample,
  runPunchThroughVoltage,
} from "./tool.js";

describe("bjt punch-through voltage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPunchThroughVoltage(punchThroughVoltageExample.input)).toEqual({
      ok: true,
      output: punchThroughVoltageExample.output,
    });
  });

  it("computes q·N·W²/(2·ε) with µm→cm conversion", () => {
    // Hand-derived: 1e17 * (5e-5)² = 2.5e8, *1.602e-19=4.005e-11 /2.07e-12≈19.33
    expect(
      runPunchThroughVoltage({ baseDopingPerCm3: 1e17, baseWidthUm: 0.5 }),
    ).toEqual({
      ok: true,
      output: { punchThroughVoltageV: 19.332401892248264 },
    });
    expect(
      calculatePunchThroughVoltage({ baseDopingPerCm3: 1e17, baseWidthUm: 0.5 })
        .punchThroughVoltageV,
    ).toBeCloseTo(19.332401892248264, 12);
  });

  it("property: Vpt ∝ N and ∝ W²", () => {
    const base = calculatePunchThroughVoltage({
      baseDopingPerCm3: 1e17,
      baseWidthUm: 0.5,
    }).punchThroughVoltageV;
    const doubleN = calculatePunchThroughVoltage({
      baseDopingPerCm3: 2e17,
      baseWidthUm: 0.5,
    }).punchThroughVoltageV;
    expect(doubleN).toBeCloseTo(base * 2, 12);
    const doubleW = calculatePunchThroughVoltage({
      baseDopingPerCm3: 1e17,
      baseWidthUm: 1.0,
    }).punchThroughVoltageV;
    expect(doubleW).toBeCloseTo(base * 4, 12);
  });

  it("rejects non-positive base doping and width via runner and direct", () => {
    for (const bad of [0, -1e16]) {
      const r = runPunchThroughVoltage({
        baseDopingPerCm3: bad,
        baseWidthUm: 0.5,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error.issues[0].field).toBe("baseDopingPerCm3");
        expect(["invalid_field", "invalid_base_doping"]).toContain(
          r.error.issues[0].code,
        );
      }
    }
    let e: unknown = null;
    try {
      calculatePunchThroughVoltage({ baseDopingPerCm3: -1, baseWidthUm: 0.5 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_base_doping");

    for (const bad of [0, -0.5]) {
      const r = runPunchThroughVoltage({
        baseDopingPerCm3: 1e17,
        baseWidthUm: bad,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.issues[0].field).toBe("baseWidthUm");
    }
    let e2: unknown = null;
    try {
      calculatePunchThroughVoltage({ baseDopingPerCm3: 1e17, baseWidthUm: 0 });
    } catch (err) {
      e2 = err;
    }
    expect((e2 as { code: string }).code).toBe("invalid_base_width");
  });

  it("rejects non-finite inputs", () => {
    expect(
      runPunchThroughVoltage({ baseDopingPerCm3: Number.NaN, baseWidthUm: 0.5 })
        .ok,
    ).toBe(false);
    expect(
      runPunchThroughVoltage({
        baseDopingPerCm3: 1e17,
        baseWidthUm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    let e: unknown = null;
    try {
      calculatePunchThroughVoltage({
        baseDopingPerCm3: Number.NaN,
        baseWidthUm: 0.5,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { field: string }).field).toBe("baseDopingPerCm3");
  });

  it("reports overflow at width field", () => {
    let e: unknown = null;
    try {
      calculatePunchThroughVoltage({
        baseDopingPerCm3: Number.MAX_VALUE,
        baseWidthUm: Number.MAX_VALUE,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("numeric_overflow");
    expect((e as { field: string }).field).toBe("baseWidthUm");
  });

  it("rejects missing, wrong type, unknown, non-object", () => {
    expect(runPunchThroughVoltage({} as any).ok).toBe(false);
    expect(
      runPunchThroughVoltage({
        baseDopingPerCm3: "1e17",
        baseWidthUm: 0.5,
      } as any).ok,
    ).toBe(false);
    const unk = runPunchThroughVoltage({
      baseDopingPerCm3: 1e17,
      baseWidthUm: 0.5,
      extra: 1,
    } as any);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runPunchThroughVoltage(null as any).ok).toBe(false);
  });
});
