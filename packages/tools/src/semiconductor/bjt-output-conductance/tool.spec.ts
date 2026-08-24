import { describe, expect, it } from "vitest";
import {
  calculateOutputConductance,
  outputConductanceExample,
  runOutputConductance,
} from "./tool.js";

describe("bjt output conductance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOutputConductance(outputConductanceExample.input)).toEqual({
      ok: true,
      output: outputConductanceExample.output,
    });
  });

  it("computes go = IC / VA with milliamp conversion", () => {
    expect(
      runOutputConductance({ collectorCurrentMa: 10, earlyVoltageV: 50 }),
    ).toEqual({
      ok: true,
      output: { outputConductanceS: 0.0002 },
    });
    expect(
      calculateOutputConductance({ collectorCurrentMa: 1, earlyVoltageV: 100 })
        .outputConductanceS,
    ).toBe(0.00001);
  });

  it("property: go * VA ≈ IC and inverse of Early voltage", () => {
    const go = calculateOutputConductance({
      collectorCurrentMa: 1,
      earlyVoltageV: 100,
    }).outputConductanceS;
    expect(go * 100).toBeCloseTo(0.001, 12);
    const go2 = calculateOutputConductance({
      collectorCurrentMa: 2,
      earlyVoltageV: 100,
    }).outputConductanceS;
    expect(go2).toBeCloseTo(go * 2, 12);
    const goHalfVA = calculateOutputConductance({
      collectorCurrentMa: 1,
      earlyVoltageV: 50,
    }).outputConductanceS;
    expect(goHalfVA).toBeCloseTo(go * 2, 12);
  });

  it("allows zero collector current as 0 S", () => {
    expect(
      runOutputConductance({ collectorCurrentMa: 0, earlyVoltageV: 100 }),
    ).toEqual({
      ok: true,
      output: { outputConductanceS: 0 },
    });
    expect(
      calculateOutputConductance({ collectorCurrentMa: 0, earlyVoltageV: 100 })
        .outputConductanceS,
    ).toBe(0);
    expect(
      Object.is(
        calculateOutputConductance({
          collectorCurrentMa: -0,
          earlyVoltageV: 100,
        }).outputConductanceS,
        -0,
      ),
    ).toBe(false);
  });

  it("rejects negative collector current", () => {
    const r = runOutputConductance({
      collectorCurrentMa: -1,
      earlyVoltageV: 100,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.issues[0].field).toBe("collectorCurrentMa");
      expect(["invalid_field", "invalid_collector_current"]).toContain(
        r.error.issues[0].code,
      );
    }
    let e: unknown = null;
    try {
      calculateOutputConductance({
        collectorCurrentMa: -1,
        earlyVoltageV: 100,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_collector_current");
  });

  it("rejects non-positive Early voltage", () => {
    for (const bad of [0, -50]) {
      const r = runOutputConductance({
        collectorCurrentMa: 1,
        earlyVoltageV: bad,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error.issues[0].field).toBe("earlyVoltageV");
        expect(["invalid_field", "invalid_early_voltage"]).toContain(
          r.error.issues[0].code,
        );
      }
    }
    let e: unknown = null;
    try {
      calculateOutputConductance({ collectorCurrentMa: 1, earlyVoltageV: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_early_voltage");
  });

  it("rejects non-finite inputs", () => {
    expect(
      runOutputConductance({
        collectorCurrentMa: Number.NaN,
        earlyVoltageV: 100,
      }).ok,
    ).toBe(false);
    expect(
      runOutputConductance({
        collectorCurrentMa: 1,
        earlyVoltageV: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    let e: unknown = null;
    try {
      calculateOutputConductance({
        collectorCurrentMa: Number.NaN,
        earlyVoltageV: 100,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { field: string }).field).toBe("collectorCurrentMa");
  });

  it("reports overflow at Early voltage field", () => {
    let e: unknown = null;
    try {
      calculateOutputConductance({
        collectorCurrentMa: Number.MAX_VALUE,
        earlyVoltageV: Number.MIN_VALUE,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("numeric_overflow");
    expect((e as { field: string }).field).toBe("earlyVoltageV");
  });

  it("rejects missing, wrong type, unknown, non-object", () => {
    expect(runOutputConductance({} as any).ok).toBe(false);
    expect(
      runOutputConductance({
        collectorCurrentMa: "1mA",
        earlyVoltageV: 100,
      } as any).ok,
    ).toBe(false);
    const unk = runOutputConductance({
      collectorCurrentMa: 1,
      earlyVoltageV: 100,
      temp: 27,
    } as any);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runOutputConductance(null as any).ok).toBe(false);
  });
});
