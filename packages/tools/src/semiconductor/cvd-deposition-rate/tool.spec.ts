import { describe, expect, it } from "vitest";
import {
  calculateCvdDepositionRate,
  cvdDepositionRateExample,
  runCvdDepositionRate,
} from "./tool.js";

describe("cvd deposition rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCvdDepositionRate(cvdDepositionRateExample.input)).toEqual({
      ok: true,
      output: cvdDepositionRateExample.output,
    });
  });

  it("maps 500 nm in 25 minutes to exactly 20 nm/min", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 25,
        depositedThicknessNm: 500,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 20 } });
  });

  it("maps 120 nm in 40 minutes to exactly 3 nm/min", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 40,
        depositedThicknessNm: 120,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 3 } });
  });

  it("maps 75 nm in 15 minutes to exactly 5 nm/min", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 15,
        depositedThicknessNm: 75,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 5 } });
  });

  it("returns one nanometer per minute for a matching thickness and time", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 9,
        depositedThicknessNm: 9,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 1 } });
  });

  it("round-trips rate times time back to the film thickness", () => {
    const result = runCvdDepositionRate({
      depositionTimeMinutes: 25,
      depositedThicknessNm: 500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      (result.output as { rateNmPerMinute: number }).rateNmPerMinute * 25,
    ).toBe(500);
  });

  it("doubles the rate when the same thickness deposits in half the time", () => {
    const slow = calculateCvdDepositionRate({
      depositionTimeMinutes: 60,
      depositedThicknessNm: 300,
    }).rateNmPerMinute;
    const fast = calculateCvdDepositionRate({
      depositionTimeMinutes: 30,
      depositedThicknessNm: 300,
    }).rateNmPerMinute;
    expect(fast).toBe(slow * 2);
  });

  it("accepts sub-nanometer thicknesses", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 10,
        depositedThicknessNm: 0.5,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 0.05 } });
  });

  it("allows zero thickness as 0 rate and rejects negative thickness", () => {
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 25,
        depositedThicknessNm: 0,
      }),
    ).toEqual({ ok: true, output: { rateNmPerMinute: 0 } });
    expect(
      calculateCvdDepositionRate({
        depositionTimeMinutes: 25,
        depositedThicknessNm: 0,
      }).rateNmPerMinute,
    ).toBe(0);
    const neg = runCvdDepositionRate({
      depositionTimeMinutes: 25,
      depositedThicknessNm: -100,
    });
    expect(neg.ok).toBe(false);
    if (neg.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_deposited_thickness"]).toContain(
      neg.error.issues[0].code,
    );
  });

  it("rejects zero and negative deposition time via schema", () => {
    for (const t of [0, -5]) {
      const result = runCvdDepositionRate({
        depositionTimeMinutes: t,
        depositedThicknessNm: 500,
      });
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_deposition_time"]).toContain(
        result.error.issues[0].code,
      );
      expect(result.error.issues[0].field).toBe("depositionTimeMinutes");
    }
    // direct also rejects
    let e: unknown = null;
    try {
      calculateCvdDepositionRate({
        depositionTimeMinutes: 0,
        depositedThicknessNm: 500,
      });
    } catch (err) {
      e = err;
    }
    expect(e).not.toBeNull();
  });

  it("rejects missing, non-numeric, and non-finite inputs", () => {
    const missing = runCvdDepositionRate({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: "all night",
        depositedThicknessNm: 500,
      }).ok,
    ).toBe(false);
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: Number.NaN,
        depositedThicknessNm: 500,
      }).ok,
    ).toBe(false);
    expect(
      runCvdDepositionRate({
        depositionTimeMinutes: 25,
        depositedThicknessNm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runCvdDepositionRate({
      depositionTimeMinutes: 25,
      depositedThicknessNm: 500,
      precursor: "TEOS",
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runCvdDepositionRate(null);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("direct and property: rate·time ≈ thickness, scaling preserves rate", () => {
    const r = calculateCvdDepositionRate({
      depositionTimeMinutes: 25,
      depositedThicknessNm: 500,
    }).rateNmPerMinute;
    expect(r * 25).toBeCloseTo(500, 12);
    const r2 = calculateCvdDepositionRate({
      depositionTimeMinutes: 50,
      depositedThicknessNm: 1000,
    }).rateNmPerMinute;
    expect(r2).toBeCloseTo(r, 12);
    expect(() =>
      calculateCvdDepositionRate({
        depositionTimeMinutes: 0,
        depositedThicknessNm: 500,
      }),
    ).toThrow();
  });
});
