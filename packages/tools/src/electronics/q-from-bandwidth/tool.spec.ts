import { describe, expect, it } from "vitest";
import { qFromBandwidthExample, runQFromBandwidth } from "./tool.js";

describe("Q From Bandwidth", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runQFromBandwidth(qFromBandwidthExample.input)).toEqual({
      ok: true,
      output: qFromBandwidthExample.output,
    }));

  it("divides a 4700 Hz resonance by a 235 Hz bandwidth", () =>
    expect(
      runQFromBandwidth({ bandwidthHz: 235, resonantFreqHz: 4700 }),
    ).toEqual({ ok: true, output: { qFactor: 20 } }));

  it("doubles Q when resonant frequency doubles", () => {
    const base = runQFromBandwidth({
      bandwidthHz: 100,
      resonantFreqHz: 500,
    });
    const scaled = runQFromBandwidth({
      bandwidthHz: 100,
      resonantFreqHz: 1000,
    });
    expect(base).toEqual({ ok: true, output: { qFactor: 5 } });
    expect(scaled).toEqual({ ok: true, output: { qFactor: 10 } });
  });

  it("halves Q when bandwidth doubles", () =>
    expect(
      runQFromBandwidth({ bandwidthHz: 200, resonantFreqHz: 1000 }),
    ).toEqual({ ok: true, output: { qFactor: 5 } }));

  it("rejects zero bandwidth", () =>
    expect(
      runQFromBandwidth({ bandwidthHz: 0, resonantFreqHz: 1000 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "bandwidthHz" }] },
      ok: false,
    }));

  it("rejects negative resonant frequency", () =>
    expect(
      runQFromBandwidth({ bandwidthHz: 100, resonantFreqHz: -1000 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resonantFreqHz" }],
      },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runQFromBandwidth({
        bandwidthHz: Number.POSITIVE_INFINITY,
        resonantFreqHz: 1000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bandwidthHz" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runQFromBandwidth({ resonantFreqHz: 1000 } as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "bandwidthHz" }] },
      ok: false,
    }));
});
