import { describe, expect, it } from "vitest";
import {
  runSingleEventUpsetRate,
  singleEventUpsetRateExample,
} from "./tool.js";

describe("Single Event Upset Rate Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSingleEventUpsetRate(singleEventUpsetRateExample.input)).toEqual({
      ok: true,
      output: singleEventUpsetRateExample.output,
    }));

  it("returns zero upsets at zero flux", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 0,
        sensitiveCrossSectionUm2: 100,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 0 } }));

  it("returns zero upsets at zero cross section", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 1000,
        sensitiveCrossSectionUm2: 0,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 0 } }));

  it("scales linearly with flux", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 20,
        sensitiveCrossSectionUm2: 100,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 1.7280000000000002 } }));

  it("scales linearly with cross section", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 10,
        sensitiveCrossSectionUm2: 50,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 0.43200000000000005 } }));

  it("converts one square micron per square centimeter per second to one upset per day", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 1,
        sensitiveCrossSectionUm2: 1e8,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 86400 } }));

  it("handles heavy-ion test conditions", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 1e5,
        sensitiveCrossSectionUm2: 0.01,
      }),
    ).toEqual({ ok: true, output: { upsetsPerDay: 0.8640000000000001 } }));

  it("rejects negative flux", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: -1,
        sensitiveCrossSectionUm2: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "particleFluxPerCm2PerSecond" },
        ],
      },
      ok: false,
    }));

  it("rejects negative cross section", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: 10,
        sensitiveCrossSectionUm2: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "sensitiveCrossSectionUm2" }],
      },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runSingleEventUpsetRate({
        particleFluxPerCm2PerSecond: Number.NaN,
        sensitiveCrossSectionUm2: 100,
      }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () =>
    expect(
      runSingleEventUpsetRate({
        extra: 1,
        particleFluxPerCm2PerSecond: 10,
        sensitiveCrossSectionUm2: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
