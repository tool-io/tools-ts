import { describe, expect, it } from "vitest";
import {
  resonantTunnelingCurrentExample,
  runResonantTunnelingCurrent,
} from "./tool.js";

describe("RTD Peak-to-Valley Ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResonantTunnelingCurrent(resonantTunnelingCurrentExample.input),
    ).toEqual({ ok: true, output: resonantTunnelingCurrentExample.output });
  });

  it("returns unity when peak and valley match", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: 3.3, valleyCurrentMa: 3.3 }),
    ).toEqual({ ok: true, output: { peakToValleyRatio: 1 } });
  });

  it("rejects readings where the named peak is below the valley", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: 1, valleyCurrentMa: 4 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_peak_current", field: "peakCurrentMa" }],
      },
      ok: false,
    });
  });

  it("matches a typical room-temperature GaAs RTD", () => {
    expect(
      runResonantTunnelingCurrent({
        peakCurrentMa: 12.4,
        valleyCurrentMa: 3.1,
      }),
    ).toEqual({ ok: true, output: { peakToValleyRatio: 4 } });
  });

  it("is independent of absolute scale", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: 100, valleyCurrentMa: 20 }),
    ).toEqual({ ok: true, output: { peakToValleyRatio: 5 } });
  });

  it("rejects a zero peak current", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: 0, valleyCurrentMa: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a zero valley current", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: 1, valleyCurrentMa: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a negative peak current", () => {
    expect(
      runResonantTunnelingCurrent({ peakCurrentMa: -10, valleyCurrentMa: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects non-finite valley current", () => {
    expect(
      runResonantTunnelingCurrent({
        peakCurrentMa: 10,
        valleyCurrentMa: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing valley current", () => {
    expect(runResonantTunnelingCurrent({ peakCurrentMa: 10 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });
});
