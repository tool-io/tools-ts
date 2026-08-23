import { describe, expect, it } from "vitest";
import {
  calculateEpitaxyGrowthRate,
  runEpitaxyGrowthRate,
  epitaxyGrowthRateExample,
} from "./tool.js";

describe("epitaxy growth rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEpitaxyGrowthRate(epitaxyGrowthRateExample.input)).toEqual({
      ok: true,
      output: epitaxyGrowthRateExample.output,
    });
  });

  it("maps 2 um in 20 minutes to exactly 0.1 um/min", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 20, layerThicknessUm: 2 }),
    ).toEqual({ ok: true, output: { growthUmPerMinute: 0.1 } });
  });

  it("maps 4.5 um in 30 minutes to exactly 0.15 um/min", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 30, layerThicknessUm: 4.5 }),
    ).toEqual({ ok: true, output: { growthUmPerMinute: 0.15 } });
  });

  it("keeps exact floating point behavior for awkward inputs", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 12, layerThicknessUm: 0.6 }),
    ).toEqual({
      ok: true,
      output: { growthUmPerMinute: 0.049999999999999996 },
    });
  });

  it("returns one micron per minute for a matching thickness and time", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 7, layerThicknessUm: 7 }),
    ).toEqual({ ok: true, output: { growthUmPerMinute: 1 } });
  });

  it("round-trips rate times time back to the grown thickness", () => {
    const result = runEpitaxyGrowthRate({
      growthTimeMinutes: 30,
      layerThicknessUm: 4.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      (result.output as { growthUmPerMinute: number }).growthUmPerMinute * 30,
    ).toBe(4.5);
  });

  it("doubles the rate when the same thickness grows in half the time", () => {
    const slow = calculateEpitaxyGrowthRate({
      growthTimeMinutes: 40,
      layerThicknessUm: 3,
    }).growthUmPerMinute;
    const fast = calculateEpitaxyGrowthRate({
      growthTimeMinutes: 20,
      layerThicknessUm: 3,
    }).growthUmPerMinute;
    expect(fast).toBe(slow * 2);
  });

  it("accepts very thin layers and very short runs", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 1e-6, layerThicknessUm: 1e-9 })
        .ok,
    ).toBe(true);
  });

  it("allows zero thickness as 0 rate and rejects negative thickness", () => {
    expect(
      runEpitaxyGrowthRate({ growthTimeMinutes: 20, layerThicknessUm: 0 }),
    ).toEqual({
      ok: true,
      output: { growthUmPerMinute: 0 },
    });
    expect(
      calculateEpitaxyGrowthRate({ growthTimeMinutes: 20, layerThicknessUm: 0 })
        .growthUmPerMinute,
    ).toBe(0);
    const neg = runEpitaxyGrowthRate({
      growthTimeMinutes: 20,
      layerThicknessUm: -2,
    });
    expect(neg.ok).toBe(false);
    if (neg.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_layer_thickness"]).toContain(
      neg.error.issues[0].code,
    );
  });

  it("rejects zero and negative growth time via schema", () => {
    for (const t of [0, -1]) {
      const result = runEpitaxyGrowthRate({
        growthTimeMinutes: t,
        layerThicknessUm: 2,
      });
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_growth_time"]).toContain(
        result.error.issues[0].code,
      );
    }
    let e: unknown = null;
    try {
      calculateEpitaxyGrowthRate({ growthTimeMinutes: 0, layerThicknessUm: 2 });
    } catch (err) {
      e = err;
    }
    expect(e).not.toBeNull();
  });

  it("rejects missing, non-numeric, and non-finite inputs", () => {
    const missing = runEpitaxyGrowthRate({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runEpitaxyGrowthRate({
        growthTimeMinutes: "overnight",
        layerThicknessUm: 2,
      }).ok,
    ).toBe(false);
    expect(
      runEpitaxyGrowthRate({
        growthTimeMinutes: Number.POSITIVE_INFINITY,
        layerThicknessUm: 2,
      }).ok,
    ).toBe(false);
    expect(
      runEpitaxyGrowthRate({
        growthTimeMinutes: 20,
        layerThicknessUm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runEpitaxyGrowthRate({
      growthTimeMinutes: 20,
      layerThicknessUm: 2,
      waferSizeMm: 200,
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runEpitaxyGrowthRate(0.1);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("direct and property: growth·time ≈ thickness", () => {
    const r = calculateEpitaxyGrowthRate({
      growthTimeMinutes: 20,
      layerThicknessUm: 2,
    }).growthUmPerMinute;
    expect(r * 20).toBeCloseTo(2, 12);
    expect(() =>
      calculateEpitaxyGrowthRate({
        growthTimeMinutes: 0,
        layerThicknessUm: 2,
      }),
    ).toThrow();
  });
});
