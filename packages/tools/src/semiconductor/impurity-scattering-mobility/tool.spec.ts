import { describe, expect, it } from "vitest";
import {
  impurityScatteringMobilityExample,
  runImpurityScatteringMobility,
} from "./tool.js";

describe("Impurity Scattering Mobility Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runImpurityScatteringMobility(impurityScatteringMobilityExample.input),
    ).toEqual({ ok: true, output: impurityScatteringMobilityExample.output }));

  it("matches the 1.5 power law with reduced doping at 450 K", () =>
    expect(
      runImpurityScatteringMobility({
        dopingPerCm3: 1e18,
        temperatureK: 450,
      }),
    ).toEqual({
      ok: true,
      output: { mobilityCm2PerVs: 257.1964229922337 },
    }));

  it("applies the defaults when references are omitted", () => {
    const implicit = runImpurityScatteringMobility({
      dopingPerCm3: 1e16,
      temperatureK: 300,
    });
    const explicit = runImpurityScatteringMobility({
      dopingPerCm3: 1e16,
      referenceDopingPerCm3: 1e17,
      referenceMobility: 1400,
      temperatureK: 300,
    });
    expect(implicit).toEqual(explicit);
  });

  it("raises mobility with temperature at fixed doping", () => {
    const cool = runImpurityScatteringMobility({
      dopingPerCm3: 1e17,
      temperatureK: 400,
    });
    const hot = runImpurityScatteringMobility({
      dopingPerCm3: 1e17,
      temperatureK: 800,
    });
    if (!cool.ok || !hot.ok) throw new Error("expected success");
    expect(hot.output.mobilityCm2PerVs).toBeCloseTo(
      Math.pow(2, 1.5) * (cool.output.mobilityCm2PerVs as number),
      9,
    );
  });

  it("lowers mobility with heavier doping", () => {
    const light = runImpurityScatteringMobility({
      dopingPerCm3: 1e16,
      temperatureK: 300,
    });
    const heavy = runImpurityScatteringMobility({
      dopingPerCm3: 1e18,
      temperatureK: 300,
    });
    if (!light.ok || !heavy.ok) throw new Error("expected success");
    expect(heavy.output.mobilityCm2PerVs).toBeCloseTo(
      (light.output.mobilityCm2PerVs as number) / 100,
      9,
    );
  });

  it("reports invalid_temperature for zero temperature", () =>
    expect(
      runImpurityScatteringMobility({ dopingPerCm3: 1e17, temperatureK: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("reports invalid_doping for non-positive doping", () =>
    expect(
      runImpurityScatteringMobility({ dopingPerCm3: 0, temperatureK: 300 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("reports invalid_reference_mobility for non-positive references", () =>
    expect(
      runImpurityScatteringMobility({
        dopingPerCm3: 1e17,
        referenceMobility: 0,
        temperatureK: 300,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("reports invalid_reference_doping for non-positive references", () =>
    expect(
      runImpurityScatteringMobility({
        dopingPerCm3: 1e17,
        referenceDopingPerCm3: -1,
        temperatureK: 300,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a missing doping", () =>
    expect(runImpurityScatteringMobility({ temperatureK: 300 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runImpurityScatteringMobility({
        dopingPerCm3: Number.NaN,
        temperatureK: 300,
      }).ok,
    ).toBe(false));
});
