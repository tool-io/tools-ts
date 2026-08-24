import { describe, expect, it } from "vitest";
import { gaasAlasBandOffsetExample, runGaasAlasBandOffset } from "./tool.js";

describe("GaAs/AlAs Band Offset Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runGaasAlasBandOffset(gaasAlasBandOffsetExample.input)).toEqual({
      ok: true,
      output: { conductionBandOffsetEv: 0.481, valenceBandOffsetEv: 0.259 },
    }));

  it("splits a typical AlAs-on-GaAs difference", () =>
    expect(runGaasAlasBandOffset({ bandgapDifferenceEv: 2.16 })).toEqual({
      ok: true,
      output: {
        conductionBandOffsetEv: 1.4040000000000001,
        valenceBandOffsetEv: 0.756,
      },
    }));

  it("splits a small heterojunction difference", () =>
    expect(runGaasAlasBandOffset({ bandgapDifferenceEv: 0.02 })).toEqual({
      ok: true,
      output: {
        conductionBandOffsetEv: 0.013000000000000001,
        valenceBandOffsetEv: 0.006999999999999999,
      },
    }));

  it("partitions the whole difference across both bands", () => {
    const result = runGaasAlasBandOffset({ bandgapDifferenceEv: 0.74 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.conductionBandOffsetEv +
          result.output.valenceBandOffsetEv,
      ).toBe(0.74);
  });

  it("keeps the conduction offset larger than the valence offset", () => {
    const result = runGaasAlasBandOffset({ bandgapDifferenceEv: 0.5 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionBandOffsetEv).toBeGreaterThan(
        result.output.valenceBandOffsetEv,
      );
  });

  it("rejects a zero band gap difference", () =>
    expect(runGaasAlasBandOffset({ bandgapDifferenceEv: 0 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "bandgapDifferenceEv" }],
      },
      ok: false,
    }));

  it("rejects a negative band gap difference", () =>
    expect(runGaasAlasBandOffset({ bandgapDifferenceEv: -0.5 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "bandgapDifferenceEv" }],
      },
      ok: false,
    }));

  it("rejects a non-finite difference", () =>
    expect(
      runGaasAlasBandOffset({ bandgapDifferenceEv: Number.NaN }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "bandgapDifferenceEv" }],
      },
      ok: false,
    }));

  it("rejects a missing difference", () =>
    expect(runGaasAlasBandOffset({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "bandgapDifferenceEv" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runGaasAlasBandOffset({ bandgapDifferenceEv: 0.74, extra: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
