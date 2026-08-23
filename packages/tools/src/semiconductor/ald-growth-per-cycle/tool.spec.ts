import { describe, expect, it } from "vitest";
import {
  calculateAldGrowthPerCycle,
  aldGrowthPerCycleExample,
  runAldGrowthPerCycle,
} from "./tool.js";

describe("ald growth per cycle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAldGrowthPerCycle(aldGrowthPerCycleExample.input)).toEqual({
      ok: true,
      output: aldGrowthPerCycleExample.output,
    });
  });

  it("maps 50 nm over 500 cycles to exactly 0.1 nm/cycle", () => {
    expect(
      runAldGrowthPerCycle({ cycleCount: 500, totalThicknessNm: 50 }),
    ).toEqual({ ok: true, output: { growthNmPerCycle: 0.1 } });
  });

  it("maps 12 nm over 600 cycles to exactly 0.02 nm/cycle", () => {
    expect(
      runAldGrowthPerCycle({ cycleCount: 600, totalThicknessNm: 12 }),
    ).toEqual({ ok: true, output: { growthNmPerCycle: 0.02 } });
  });

  it("maps sub-angstrom films over many cycles", () => {
    expect(
      runAldGrowthPerCycle({ cycleCount: 800, totalThicknessNm: 0.88 }),
    ).toEqual({ ok: true, output: { growthNmPerCycle: 0.0011 } });
  });

  it("returns the full thickness for a single cycle", () => {
    expect(
      runAldGrowthPerCycle({ cycleCount: 1, totalThicknessNm: 1.2 }),
    ).toEqual({ ok: true, output: { growthNmPerCycle: 1.2 } });
  });

  it("round-trips growth times cycles back to the thickness", () => {
    const result = runAldGrowthPerCycle({
      cycleCount: 500,
      totalThicknessNm: 50,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      (result.output as { growthNmPerCycle: number }).growthNmPerCycle * 500,
    ).toBe(50);
  });

  it("doubles the per-cycle growth when cycles halve at fixed thickness", () => {
    const many = calculateAldGrowthPerCycle({
      cycleCount: 1000,
      totalThicknessNm: 40,
    }).growthNmPerCycle;
    const few = calculateAldGrowthPerCycle({
      cycleCount: 500,
      totalThicknessNm: 40,
    }).growthNmPerCycle;
    expect(few).toBe(many * 2);
  });

  it("allows zero total thickness as 0 growth and rejects negative thickness", () => {
    expect(
      runAldGrowthPerCycle({ cycleCount: 500, totalThicknessNm: 0 }),
    ).toEqual({
      ok: true,
      output: { growthNmPerCycle: 0 },
    });
    expect(
      calculateAldGrowthPerCycle({ cycleCount: 500, totalThicknessNm: 0 })
        .growthNmPerCycle,
    ).toBe(0);
    const neg = runAldGrowthPerCycle({
      cycleCount: 500,
      totalThicknessNm: -50,
    });
    expect(neg.ok).toBe(false);
    if (neg.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_total_thickness"]).toContain(
      neg.error.issues[0].code,
    );
  });

  it("rejects a zero or negative integer cycle count via schema", () => {
    for (const bad of [0, -10]) {
      const r = runAldGrowthPerCycle({ cycleCount: bad, totalThicknessNm: 50 });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_cycle_count"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("cycleCount");
    }
    let e: unknown = null;
    try {
      calculateAldGrowthPerCycle({ cycleCount: 0, totalThicknessNm: 50 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_cycle_count");
  });

  it("rejects fractional and non-finite cycle counts through schema validation", () => {
    const fractional = runAldGrowthPerCycle({
      cycleCount: 2.5,
      totalThicknessNm: 50,
    });
    expect(fractional.ok).toBe(false);
    if (fractional.ok) throw new Error("expected failure");
    expect(fractional.error.code).toBe("invalid_input");
    expect(fractional.error.issues[0].code).toBe("invalid_field");
    expect(
      runAldGrowthPerCycle({
        cycleCount: Number.NaN,
        totalThicknessNm: 50,
      }).ok,
    ).toBe(false);
    expect(
      runAldGrowthPerCycle({
        cycleCount: Number.POSITIVE_INFINITY,
        totalThicknessNm: 50,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing, non-numeric thickness, unknown fields, and non-object input", () => {
    const missing = runAldGrowthPerCycle({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runAldGrowthPerCycle({ cycleCount: 500, totalThicknessNm: "thick" }).ok,
    ).toBe(false);
    const unknown = runAldGrowthPerCycle({
      cycleCount: 500,
      totalThicknessNm: 50,
      precursor: "TMA",
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runAldGrowthPerCycle(50);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("direct and property: growth·cycles ≈ thickness", () => {
    const g = calculateAldGrowthPerCycle({
      cycleCount: 500,
      totalThicknessNm: 50,
    }).growthNmPerCycle;
    expect(g * 500).toBeCloseTo(50, 12);
    expect(() =>
      calculateAldGrowthPerCycle({
        cycleCount: 0,
        totalThicknessNm: 50,
      }),
    ).toThrow();
    expect(() =>
      calculateAldGrowthPerCycle({
        cycleCount: 500,
        totalThicknessNm: Number.NaN,
      }),
    ).toThrow();
  });
});
