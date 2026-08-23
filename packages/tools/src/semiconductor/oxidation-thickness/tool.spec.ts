import { describe, expect, it } from "vitest";
import {
  oxideThicknessExample,
  runOxideThickness,
  calculateOxideThickness,
} from "./tool.js";

describe("Parabolic Oxide Thickness Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const result = runOxideThickness(oxideThicknessExample.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.oxideThicknessNm).toBeCloseTo(
        oxideThicknessExample.output.oxideThicknessNm,
        12,
      );
  });

  it("returns zero thickness for zero oxidation time", () => {
    expect(
      runOxideThickness({
        parabolicRateConstantNm2PerHour: 0.5,
        oxidationTimeHours: 0,
      }),
    ).toEqual({ ok: true, output: { oxideThicknessNm: 0 } });
  });

  it("doubles the thickness when the oxidation time quadruples", () => {
    const r = runOxideThickness({
      parabolicRateConstantNm2PerHour: 2,
      oxidationTimeHours: 8,
    });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(
        (r.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(4, 12);
  });

  it("computes fractional thicknesses exactly", () => {
    const r = runOxideThickness({
      parabolicRateConstantNm2PerHour: 0.12,
      oxidationTimeHours: 50,
    });
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(
        (r.output as { oxideThicknessNm: number }).oxideThicknessNm,
      ).toBeCloseTo(2.449489742783178, 12);
  });

  it("grows monotonically with oxidation time", () => {
    const short = runOxideThickness({
      parabolicRateConstantNm2PerHour: 1,
      oxidationTimeHours: 1,
    });
    const long = runOxideThickness({
      parabolicRateConstantNm2PerHour: 1,
      oxidationTimeHours: 9,
    });
    if (!short.ok || !long.ok) throw new Error("Expected success results.");
    expect(long.output.oxideThicknessNm as number).toBeGreaterThan(
      short.output.oxideThicknessNm as number,
    );
  });

  it("rejects a zero parabolic rate constant via schema", () => {
    const result = runOxideThickness({
      parabolicRateConstantNm2PerHour: 0,
      oxidationTimeHours: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "parabolicRateConstantNm2PerHour",
      });
  });

  it("rejects a negative parabolic rate constant through schema validation", () => {
    const result = runOxideThickness({
      parabolicRateConstantNm2PerHour: -0.5,
      oxidationTimeHours: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "parabolicRateConstantNm2PerHour",
      });
  });

  it("rejects negative oxidation time through schema validation", () => {
    const result = runOxideThickness({
      parabolicRateConstantNm2PerHour: 0.5,
      oxidationTimeHours: -2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "oxidationTimeHours",
      });
  });

  it("rejects non-finite inputs", () => {
    const result = runOxideThickness({
      parabolicRateConstantNm2PerHour: Number.POSITIVE_INFINITY,
      oxidationTimeHours: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const result = runOxideThickness({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects input that is not an object", () => {
    const result = runOxideThickness(3.14);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("object_required");
  });

  it("direct and property: thickness^2 ≈ B·t", () => {
    const t = calculateOxideThickness({
      parabolicRateConstantNm2PerHour: 0.5,
      oxidationTimeHours: 2,
    }).oxideThicknessNm;
    expect(t * t).toBeCloseTo(1, 12);
    expect(
      calculateOxideThickness({
        parabolicRateConstantNm2PerHour: 0.5,
        oxidationTimeHours: 0,
      }).oxideThicknessNm,
    ).toBe(0);
    expect(() =>
      calculateOxideThickness({
        parabolicRateConstantNm2PerHour: -1,
        oxidationTimeHours: 2,
      }),
    ).toThrow();
  });

  it("avoids overflow in B·t when the square root is finite", () => {
    expect(
      calculateOxideThickness({
        oxidationTimeHours: 1e200,
        parabolicRateConstantNm2PerHour: 1e200,
      }).oxideThicknessNm,
    ).toBe(1e200);
  });
});
