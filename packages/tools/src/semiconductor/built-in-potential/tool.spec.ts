import { describe, expect, it } from "vitest";
import {
  builtInPotentialExample,
  calculateBuiltInPotential,
  runBuiltInPotential,
} from "./tool.js";

describe("built-in potential calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBuiltInPotential(builtInPotentialExample.input)).toEqual({
      ok: true,
      output: builtInPotentialExample.output,
    });
  });

  it("computes Vbi = Vt·ln(NA·ND/ni²) with Vt=0.02585 V at 300 K", () => {
    // Hand: NA=1e16, ND=1e18, ni=1.5e10 => ratio=4.44e13, ln=31.425, *0.02585=0.81234
    expect(
      calculateBuiltInPotential({
        acceptorConcentrationPerCm3: 1e16,
        donorConcentrationPerCm3: 1e18,
        niPerCm3: 1.5e10,
      }).builtInVoltageV,
    ).toBeCloseTo(0.812342999065353, 12);
    expect(
      calculateBuiltInPotential({
        acceptorConcentrationPerCm3: 1e15,
        donorConcentrationPerCm3: 1e15,
        niPerCm3: 1e10,
      }).builtInVoltageV,
    ).toBeCloseTo(0.02585 * Math.log(1e30 / 1e20), 12);
  });

  it("property: Vbi monotonic with NA·ND and inverse with ni, and exponential inverse", () => {
    const base = calculateBuiltInPotential({
      acceptorConcentrationPerCm3: 1e16,
      donorConcentrationPerCm3: 1e18,
      niPerCm3: 1.5e10,
    }).builtInVoltageV;
    const higher = calculateBuiltInPotential({
      acceptorConcentrationPerCm3: 1e17,
      donorConcentrationPerCm3: 1e19,
      niPerCm3: 1.5e10,
    }).builtInVoltageV;
    expect(higher).toBeGreaterThan(base);
    const lowerNi = calculateBuiltInPotential({
      acceptorConcentrationPerCm3: 1e16,
      donorConcentrationPerCm3: 1e18,
      niPerCm3: 1e9,
    }).builtInVoltageV;
    expect(lowerNi).toBeGreaterThan(base);
    // Inverse: NA·ND = ni²·exp(Vbi/Vt) - check via ratio
    const Vt = 0.02585;
    const recoveredRatio = Math.exp(base / Vt);
    const expectedRatio = (1e16 * 1e18) / (1.5e10 * 1.5e10);
    expect(recoveredRatio / expectedRatio).toBeCloseTo(1, 10);
  });

  it("rejects concentrations that do not define a positive pn-junction potential", () => {
    for (const input of [
      {
        acceptorConcentrationPerCm3: 1e10,
        donorConcentrationPerCm3: 1e10,
        niPerCm3: 1e12,
      },
      {
        acceptorConcentrationPerCm3: 1e10,
        donorConcentrationPerCm3: 2.25e10,
        niPerCm3: 1.5e10,
      },
    ]) {
      expect(runBuiltInPotential(input).ok).toBe(false);
      expect(() => calculateBuiltInPotential(input)).toThrow();
    }
  });

  it("rejects non-positive and non-finite concentrations via runner and direct", () => {
    for (const bad of [
      {
        acceptorConcentrationPerCm3: 0,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: 1.5e10,
      },
      {
        acceptorConcentrationPerCm3: -1,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: 1.5e10,
      },
      {
        acceptorConcentrationPerCm3: Number.NaN,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: 1.5e10,
      },
      {
        acceptorConcentrationPerCm3: 1e16,
        donorConcentrationPerCm3: Number.POSITIVE_INFINITY,
        niPerCm3: 1.5e10,
      },
    ]) {
      const r = runBuiltInPotential(bad as any);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.issues[0].field).toBeDefined();
    }
    let e: unknown = null;
    try {
      calculateBuiltInPotential({
        acceptorConcentrationPerCm3: 0,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: 1.5e10,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_acceptor");
    e = null;
    try {
      calculateBuiltInPotential({
        acceptorConcentrationPerCm3: 1e16,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: Number.NaN,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { field: string }).field).toBe("niPerCm3");
  });

  it("handles extreme doping without overflow where mathematically finite", () => {
    const result = calculateBuiltInPotential({
      acceptorConcentrationPerCm3: Number.MAX_VALUE,
      donorConcentrationPerCm3: Number.MAX_VALUE,
      niPerCm3: Number.MIN_VALUE,
    });
    expect(Number.isFinite(result.builtInVoltageV)).toBe(true);
    // Overflow case: ni=0 would be invalid, but Extremely small ni already handled; test overflow via non-finite input
    let e: unknown = null;
    try {
      calculateBuiltInPotential({
        acceptorConcentrationPerCm3: Number.POSITIVE_INFINITY,
        donorConcentrationPerCm3: 1e16,
        niPerCm3: 1.5e10,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBeDefined();
  });

  it("rejects missing, wrong type, unknown, non-object", () => {
    expect(runBuiltInPotential({} as any).ok).toBe(false);
    expect(
      runBuiltInPotential({
        acceptorConcentrationPerCm3: "1e16",
        donorConcentrationPerCm3: 1e18,
        niPerCm3: 1.5e10,
      } as any).ok,
    ).toBe(false);
    const unk = runBuiltInPotential({
      acceptorConcentrationPerCm3: 1e16,
      donorConcentrationPerCm3: 1e18,
      niPerCm3: 1.5e10,
      extra: 1,
    } as any);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runBuiltInPotential(null as any).ok).toBe(false);
    if (!runBuiltInPotential(null as any).ok)
      expect(
        (runBuiltInPotential(null as any) as any).error.issues[0].code,
      ).toBe("object_required");
  });
});
