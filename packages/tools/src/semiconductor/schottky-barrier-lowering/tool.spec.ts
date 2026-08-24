import { describe, expect, it } from "vitest";
import {
  calculateSchottkyBarrierLowering,
  runSchottkyBarrierLowering,
  schottkyBarrierLoweringExample,
} from "./tool.js";

const lowering = calculateSchottkyBarrierLowering;

describe("schottky barrier lowering calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchottkyBarrierLowering(schottkyBarrierLoweringExample.input),
    ).toEqual({ ok: true, output: schottkyBarrierLoweringExample.output });
  });

  it("gives a sub-0.1 eV magnitude near 0.02 eV at 1e5 V/cm in silicon", () => {
    const value = lowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 11.8,
    }).barrierLoweringEv;
    expect(value).toBe(0.03493292055997656);
    expect(Math.abs(value - 0.02)).toBeLessThan(0.03);
    expect(value).toBeGreaterThan(0);
  });

  it("scales as the square root of the electric field", () => {
    const low = lowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 11.8,
    }).barrierLoweringEv;
    const high = lowering({
      electricFieldVCm: 1e6,
      relativePermittivity: 11.8,
    }).barrierLoweringEv;
    expect(high).toBe(0.11046759429125055);
    expect(high / low).toBeCloseTo(Math.sqrt(10), 12);
  });

  it("halves the field to shrink the lowering by one over root two", () => {
    expect(
      lowering({
        electricFieldVCm: 5e4,
        relativePermittivity: 11.8,
      }).barrierLoweringEv,
    ).toBe(0.024701305014610393);
  });

  it("lowers more for smaller relative permittivity", () => {
    expect(
      lowering({
        electricFieldVCm: 1e5,
        relativePermittivity: 3.9,
      }).barrierLoweringEv,
    ).toBe(0.060763614024676935);
    const si = lowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 11.8,
    }).barrierLoweringEv;
    const sio2 = lowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 3.9,
    }).barrierLoweringEv;
    expect(sio2).toBeGreaterThan(si);
  });

  it("increases monotonically with the electric field", () => {
    let previous = 0;
    for (const field of [1e3, 1e4, 1e5, 1e6, 1e7]) {
      const value = lowering({
        electricFieldVCm: field,
        relativePermittivity: 11.8,
      }).barrierLoweringEv;
      expect(value).toBeGreaterThan(previous);
      previous = value;
    }
  });

  it("accepts vacuum relative permittivity", () => {
    expect(
      runSchottkyBarrierLowering({
        electricFieldVCm: 100,
        relativePermittivity: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects zero and negative electric fields", () => {
    const result = runSchottkyBarrierLowering({
      electricFieldVCm: 0,
      relativePermittivity: 11.8,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.code).toBe("invalid_input");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_electric_field",
      field: "electricFieldVCm",
    });
    if (
      runSchottkyBarrierLowering({
        electricFieldVCm: -1e5,
        relativePermittivity: 11.8,
      }).ok
    )
      throw new Error("expected failure");
  });

  it("rejects non-positive permittivity", () => {
    const result = runSchottkyBarrierLowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_permittivity",
      field: "relativePermittivity",
    });
    expect(
      runSchottkyBarrierLowering({
        electricFieldVCm: 1e5,
        relativePermittivity: -0.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing, non-numeric, and non-finite inputs", () => {
    const missing = runSchottkyBarrierLowering({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runSchottkyBarrierLowering({
        electricFieldVCm: "high",
        relativePermittivity: 11.8,
      }).ok,
    ).toBe(false);
    expect(
      runSchottkyBarrierLowering({
        electricFieldVCm: Number.NaN,
        relativePermittivity: 11.8,
      }).ok,
    ).toBe(false);
    expect(
      runSchottkyBarrierLowering({
        electricFieldVCm: Number.POSITIVE_INFINITY,
        relativePermittivity: 11.8,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runSchottkyBarrierLowering({
      electricFieldVCm: 1e5,
      relativePermittivity: 11.8,
      temperatureK: 300,
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runSchottkyBarrierLowering([]).ok).toBe(false);
    const nonObject = runSchottkyBarrierLowering("silicon");
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });
});
