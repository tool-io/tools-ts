import { describe, expect, it } from "vitest";
import {
  calculateEarlyVoltage,
  earlyVoltageExample,
  runEarlyVoltage,
} from "./tool.js";

describe("bjt early voltage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEarlyVoltage(earlyVoltageExample.input)).toEqual({
      ok: true,
      output: earlyVoltageExample.output,
    });
  });

  it("computes VA = IC / go with milliamp to amp conversion", () => {
    // 2 mA / 20 uS = 0.002 / 2e-5 = 100 V
    expect(
      runEarlyVoltage({ collectorCurrentMa: 2, outputConductanceS: 2e-5 }),
    ).toEqual({ ok: true, output: { earlyVoltageV: 100 } });
    expect(
      calculateEarlyVoltage({
        collectorCurrentMa: 0.5,
        outputConductanceS: 5e-6,
      }),
    ).toEqual({ earlyVoltageV: 100 });
  });

  it("property: VA * go ≈ IC and monotonic with IC", () => {
    const va = calculateEarlyVoltage({
      collectorCurrentMa: 1,
      outputConductanceS: 1e-5,
    }).earlyVoltageV;
    expect(va * 1e-5).toBeCloseTo(1e-3, 12);
    const va2 = calculateEarlyVoltage({
      collectorCurrentMa: 2,
      outputConductanceS: 1e-5,
    }).earlyVoltageV;
    expect(va2).toBeCloseTo(va * 2, 12);
    const vaHalfGo = calculateEarlyVoltage({
      collectorCurrentMa: 1,
      outputConductanceS: 2e-5,
    }).earlyVoltageV;
    expect(vaHalfGo).toBeCloseTo(va / 2, 12);
  });

  it("rejects zero and negative collector current", () => {
    for (const collectorCurrentMa of [0, -0, -1]) {
      expect(
        runEarlyVoltage({ collectorCurrentMa, outputConductanceS: 1e-5 }).ok,
      ).toBe(false);
      expect(() =>
        calculateEarlyVoltage({ collectorCurrentMa, outputConductanceS: 1e-5 }),
      ).toThrow();
    }
    const neg = runEarlyVoltage({
      collectorCurrentMa: -1,
      outputConductanceS: 1e-5,
    });
    expect(neg.ok).toBe(false);
    if (!neg.ok) {
      expect(neg.error.issues[0].field).toBe("collectorCurrentMa");
      expect(["invalid_field", "invalid_collector_current"]).toContain(
        neg.error.issues[0].code,
      );
    }
    let e: unknown = null;
    try {
      calculateEarlyVoltage({
        collectorCurrentMa: -1,
        outputConductanceS: 1e-5,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_collector_current");
  });

  it("rejects non-positive conductance through runner and direct", () => {
    for (const bad of [0, -1e-5]) {
      const r = runEarlyVoltage({
        collectorCurrentMa: 1,
        outputConductanceS: bad,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error.issues[0].field).toBe("outputConductanceS");
        expect(["invalid_field", "invalid_conductance"]).toContain(
          r.error.issues[0].code,
        );
      }
    }
    let e: unknown = null;
    try {
      calculateEarlyVoltage({ collectorCurrentMa: 1, outputConductanceS: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_conductance");
  });

  it("rejects non-finite inputs", () => {
    expect(
      runEarlyVoltage({
        collectorCurrentMa: Number.NaN,
        outputConductanceS: 1e-5,
      }).ok,
    ).toBe(false);
    expect(
      runEarlyVoltage({
        collectorCurrentMa: 1,
        outputConductanceS: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    let e: unknown = null;
    try {
      calculateEarlyVoltage({
        collectorCurrentMa: Number.NaN,
        outputConductanceS: 1e-5,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string; field: string }).field).toBe(
      "collectorCurrentMa",
    );
  });

  it("reports overflow at conductance field", () => {
    let e: unknown = null;
    try {
      calculateEarlyVoltage({
        collectorCurrentMa: Number.MAX_VALUE,
        outputConductanceS: Number.MIN_VALUE,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("numeric_overflow");
    expect((e as { field: string }).field).toBe("outputConductanceS");
    const r = runEarlyVoltage({
      collectorCurrentMa: Number.MAX_VALUE,
      outputConductanceS: Number.MIN_VALUE,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.issues[0].code).toBe("numeric_overflow");
  });

  it("rejects missing, wrong type, unknown, non-object", () => {
    expect(runEarlyVoltage({} as any).ok).toBe(false);
    expect(
      runEarlyVoltage({
        collectorCurrentMa: "1mA",
        outputConductanceS: 1e-5,
      } as any).ok,
    ).toBe(false);
    const unk = runEarlyVoltage({
      collectorCurrentMa: 1,
      outputConductanceS: 1e-5,
      tempC: 27,
    } as any);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runEarlyVoltage(null as any).ok).toBe(false);
    if (!runEarlyVoltage(null as any).ok) {
      expect((runEarlyVoltage(null as any) as any).error.issues[0].code).toBe(
        "object_required",
      );
    }
  });
});
