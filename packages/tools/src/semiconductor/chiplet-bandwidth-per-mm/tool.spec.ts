import { describe, expect, it } from "vitest";
import {
  chipletBandwidthPerMmExample,
  runChipletBandwidthPerMm,
} from "./tool.js";

describe("Chiplet Bandwidth Density Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runChipletBandwidthPerMm(chipletBandwidthPerMmExample.input),
    ).toEqual({ ok: true, output: { bandwidthTBsPerMm: 0.4 } }));

  it("applies both defaults on an empty input", () =>
    expect(runChipletBandwidthPerMm({})).toEqual({
      ok: true,
      output: { bandwidthTBsPerMm: 0.4 },
    }));

  it("uses the default data rate when only traces are given", () =>
    expect(runChipletBandwidthPerMm({ tracesPerMm: 50 })).toEqual({
      ok: true,
      output: { bandwidthTBsPerMm: 0.2 },
    }));

  it("scales with trace density and data rate", () =>
    expect(
      runChipletBandwidthPerMm({ dataRateGTsPerTrace: 64, tracesPerMm: 200 }),
    ).toEqual({ ok: true, output: { bandwidthTBsPerMm: 1.6 } }));

  it("accounts for payload bits represented by each transfer", () =>
    expect(
      runChipletBandwidthPerMm({
        bitsPerTransfer: 2,
        dataRateGTsPerTrace: 32,
        tracesPerMm: 100,
      }),
    ).toEqual({ ok: true, output: { bandwidthTBsPerMm: 0.8 } }));

  it("rejects zero trace density with a stable code", () =>
    expect(
      runChipletBandwidthPerMm({
        ...chipletBandwidthPerMmExample.input,
        tracesPerMm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tracesPerMm" }] },
      ok: false,
    }));

  it("rejects negative trace density with a stable code", () =>
    expect(
      runChipletBandwidthPerMm({
        ...chipletBandwidthPerMmExample.input,
        tracesPerMm: -10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tracesPerMm" }] },
      ok: false,
    }));

  it("rejects zero per-trace data rate with a stable code", () =>
    expect(
      runChipletBandwidthPerMm({
        ...chipletBandwidthPerMmExample.input,
        dataRateGTsPerTrace: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "dataRateGTsPerTrace" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runChipletBandwidthPerMm({
        ...chipletBandwidthPerMmExample.input,
        lanes: 8,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "lanes" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runChipletBandwidthPerMm({
        ...chipletBandwidthPerMmExample.input,
        dataRateGTsPerTrace: Number.NaN,
      }).ok,
    ).toBe(false));
});
