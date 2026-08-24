import { describe, expect, it } from "vitest";
import {
  runWkbTunnelingProbability,
  wkbTunnelingProbabilityExample,
} from "./tool.js";

describe("WKB Tunneling Probability Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWkbTunnelingProbability(wkbTunnelingProbabilityExample.input),
    ).toEqual({ ok: true, output: wkbTunnelingProbabilityExample.output });
  });

  it("decays exponentially with barrier width", () => {
    expect(
      runWkbTunnelingProbability({ barrierHeightEv: 1, barrierWidthNm: 0.5 }),
    ).toEqual({
      ok: true,
      output: { transmissionProbability: 0.00595712542020488 },
    });
  });

  it("decays monotonically as the width grows", () => {
    const thin = runWkbTunnelingProbability({
      barrierHeightEv: 2,
      barrierWidthNm: 1,
    });
    const thick = runWkbTunnelingProbability({
      barrierHeightEv: 2,
      barrierWidthNm: 3,
    });
    expect(thin.ok).toBe(true);
    expect(thick.ok).toBe(true);
    if (!thin.ok || !thick.ok) return;
    const thinValue = thin.output.transmissionProbability as number;
    const thickValue = thick.output.transmissionProbability as number;
    expect(thickValue).toBeLessThan(thinValue);
  });

  it("suppresses tunneling for taller barriers at fixed width", () => {
    const low = runWkbTunnelingProbability({
      barrierHeightEv: 1,
      barrierWidthNm: 1,
    });
    const high = runWkbTunnelingProbability({
      barrierHeightEv: 4,
      barrierWidthNm: 1,
    });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    expect(high.output.transmissionProbability as number).toBeLessThan(
      low.output.transmissionProbability as number,
    );
  });

  it("uses the semiconductor effective mass in the WKB exponent", () => {
    expect(
      runWkbTunnelingProbability({
        barrierHeightEv: 1,
        barrierWidthNm: 1,
        effectiveMassRatio: 0.067,
      }),
    ).toEqual({
      ok: true,
      output: { transmissionProbability: 0.07049609835217294 },
    });
  });

  it("yields near-unity transmission for a very low thin barrier", () => {
    const result = runWkbTunnelingProbability({
      barrierHeightEv: 0.01,
      barrierWidthNm: 1,
    });
    expect(result).toEqual({
      ok: true,
      output: { transmissionProbability: 0.3589280080582947 },
    });
    if (!result.ok) return;
    expect(result.output.transmissionProbability).toBeLessThan(1);
  });

  it("stays positive for wide high barriers", () => {
    const result = runWkbTunnelingProbability({
      barrierHeightEv: 9,
      barrierWidthNm: 10,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.transmissionProbability).toBeGreaterThan(0);
  });

  it("rejects a zero barrier height", () => {
    expect(
      runWkbTunnelingProbability({ barrierHeightEv: 0, barrierWidthNm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a negative barrier height", () => {
    expect(
      runWkbTunnelingProbability({ barrierHeightEv: -1, barrierWidthNm: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a zero barrier width", () => {
    expect(
      runWkbTunnelingProbability({ barrierHeightEv: 1, barrierWidthNm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects non-finite widths", () => {
    expect(
      runWkbTunnelingProbability({
        barrierHeightEv: 1,
        barrierWidthNm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runWkbTunnelingProbability({ barrierHeightEv: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("reports probabilities below floating-point resolution", () => {
    expect(
      runWkbTunnelingProbability({
        barrierHeightEv: 100,
        barrierWidthNm: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "result_underflow" }] },
      ok: false,
    });
  });
});
