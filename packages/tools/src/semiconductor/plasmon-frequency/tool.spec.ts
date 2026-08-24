import { describe, expect, it } from "vitest";
import { plasmonFrequencyExample, runPlasmonFrequency } from "./tool.js";

describe("Plasmon Frequency Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPlasmonFrequency(plasmonFrequencyExample.input)).toEqual({
      ok: true,
      output: plasmonFrequencyExample.output,
    }));

  it("matches the density maximum result exactly", () =>
    expect(runPlasmonFrequency({ electronDensityPerM3: 1e30 })).toEqual({
      ok: true,
      output: {
        plasmaAngularFrequencyRadPerS: 56414602298426080,
        terahertzFrequency: 8978.66281835791,
      },
    }));

  it("scales with the square root of density", () => {
    const base = runPlasmonFrequency({ electronDensityPerM3: 1e25 });
    const doubled = runPlasmonFrequency({ electronDensityPerM3: 2e25 });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(
      (doubled.output.plasmaAngularFrequencyRadPerS as number) /
        (base.output.plasmaAngularFrequencyRadPerS as number),
    ).toBeCloseTo(Math.SQRT2, 12);
  });

  it("keeps terahertz frequency consistent with angular frequency", () => {
    const result = runPlasmonFrequency({ electronDensityPerM3: 1e27 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.terahertzFrequency).toBeCloseTo(
      (result.output.plasmaAngularFrequencyRadPerS as number) /
        (2 * Math.PI * 1e12),
      12,
    );
  });

  it("accepts positive finite densities without arbitrary range limits", () => {
    expect(runPlasmonFrequency({ electronDensityPerM3: 1e20 }).ok).toBe(true);
    expect(runPlasmonFrequency({ electronDensityPerM3: 1.1e30 }).ok).toBe(true);
  });

  it("rejects zero density", () =>
    expect(runPlasmonFrequency({ electronDensityPerM3: 0 }).ok).toBe(false));

  it("rejects non-finite density", () =>
    expect(runPlasmonFrequency({ electronDensityPerM3: Number.NaN }).ok).toBe(
      false,
    ));

  it("rejects a missing density", () =>
    expect(runPlasmonFrequency({})).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));
});
