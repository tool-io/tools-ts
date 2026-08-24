import { describe, expect, it } from "vitest";
import {
  calculateEuvPhotonShotNoise,
  euvPhotonShotNoiseExample,
  runEuvPhotonShotNoise,
} from "./tool.js";

describe("EUV Photon Shot Noise Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEuvPhotonShotNoise(euvPhotonShotNoiseExample.input)).toEqual({
      ok: true,
      output: euvPhotonShotNoiseExample.output,
    });
  });

  it("follows the inverse square-root count law", () => {
    expect(
      calculateEuvPhotonShotNoise({ expectedPhotonCountPerPoint: 400 }),
    ).toEqual({ shotNoisePercent: 5 });
    expect(
      calculateEuvPhotonShotNoise({ expectedPhotonCountPerPoint: 1 }),
    ).toEqual({ shotNoisePercent: 100 });
  });

  it("accepts a fractional Poisson expectation", () => {
    expect(
      runEuvPhotonShotNoise({ expectedPhotonCountPerPoint: 0.25 }),
    ).toEqual({ ok: true, output: { shotNoisePercent: 200 } });
  });

  it("accepts large finite expectations", () => {
    expect(
      runEuvPhotonShotNoise({ expectedPhotonCountPerPoint: 1_000_000 }),
    ).toEqual({ ok: true, output: { shotNoisePercent: 0.1 } });
  });

  it.each([0, -50, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects an invalid expected photon count: %s",
    (expectedPhotonCountPerPoint) => {
      expect(() =>
        calculateEuvPhotonShotNoise({ expectedPhotonCountPerPoint }),
      ).toThrow();
      expect(runEuvPhotonShotNoise({ expectedPhotonCountPerPoint }).ok).toBe(
        false,
      );
    },
  );

  it("rejects missing and unknown fields", () => {
    expect(runEuvPhotonShotNoise({} as never).ok).toBe(false);
    expect(runEuvPhotonShotNoise({ extra: 1 } as never)).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
