import { describe, expect, it } from "vitest";
import {
  runVelocitySaturationField,
  velocitySaturationFieldExample,
} from "./tool.js";

describe("Saturation Field Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runVelocitySaturationField(velocitySaturationFieldExample.input),
    ).toEqual({ ok: true, output: velocitySaturationFieldExample.output }));

  it("doubles the critical field when mobility halves", () =>
    expect(
      runVelocitySaturationField({
        mobilityCm2PerVs: 700,
        saturationVelocityCmPerS: 1e7,
      }),
    ).toEqual({
      ok: true,
      output: { criticalFieldKVcm: 14.285714285714286 },
    }));

  it("scales linearly with saturation velocity", () =>
    expect(
      runVelocitySaturationField({
        mobilityCm2PerVs: 1400,
        saturationVelocityCmPerS: 2e7,
      }),
    ).toEqual({
      ok: true,
      output: { criticalFieldKVcm: 14.285714285714286 },
    }));

  it("halves the field when mobility doubles", () => {
    const base = runVelocitySaturationField({
      mobilityCm2PerVs: 1400,
      saturationVelocityCmPerS: 1e7,
    });
    const faster = runVelocitySaturationField({
      mobilityCm2PerVs: 2800,
      saturationVelocityCmPerS: 1e7,
    });
    if (!base.ok || !faster.ok) throw new Error("expected success");
    expect(faster.output.criticalFieldKVcm).toBeCloseTo(
      (base.output.criticalFieldKVcm as number) / 2,
      12,
    );
  });

  it("stays finite for a very high mobility", () => {
    const result = runVelocitySaturationField({
      mobilityCm2PerVs: 1e6,
      saturationVelocityCmPerS: 1e7,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.criticalFieldKVcm).toBeCloseTo(0.01, 12);
  });

  it("reports invalid_saturation_velocity for non-positive velocity", () =>
    expect(
      runVelocitySaturationField({
        mobilityCm2PerVs: 1400,
        saturationVelocityCmPerS: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_saturation_velocity" }] },
      ok: false,
    }));

  it("reports invalid_mobility for negative mobility", () =>
    expect(
      runVelocitySaturationField({
        mobilityCm2PerVs: -1400,
        saturationVelocityCmPerS: 1e7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_mobility" }] },
      ok: false,
    }));

  it("rejects missing inputs", () =>
    expect(runVelocitySaturationField({})).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runVelocitySaturationField({
        mobilityCm2PerVs: Number.NaN,
        saturationVelocityCmPerS: 1e7,
      }).ok,
    ).toBe(false));
});
