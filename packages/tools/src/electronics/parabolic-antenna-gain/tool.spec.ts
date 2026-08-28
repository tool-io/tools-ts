import { describe, expect, it } from "vitest";
import {
  calculateParabolicAntennaGain,
  parabolicAntennaGainExample,
  runParabolicAntennaGain,
} from "./tool.js";

describe("Parabolic Dish Gain dBi", () => {
  it("reproduces its canonical example with the default efficiency", () => {
    expect(runParabolicAntennaGain(parabolicAntennaGainExample.input)).toEqual({
      ok: true,
      output: parabolicAntennaGainExample.output,
    });
  });

  it("matches the formula for an explicit efficiency of 0.55", () => {
    expect(
      runParabolicAntennaGain({
        dishDiameterMeters: 1,
        efficiencyFraction: 0.55,
        wavelengthMeters: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { parabolicGainDbi: 10 * Math.log10(0.55 * (Math.PI * 10) ** 2) },
    });
  });

  it("adds six dB when the diameter doubles at fixed wavelength", () => {
    const small = calculateParabolicAntennaGain({
      dishDiameterMeters: 0.5,
      wavelengthMeters: 0.03,
    }).parabolicGainDbi;
    const large = calculateParabolicAntennaGain({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.03,
    }).parabolicGainDbi;
    expect(large - small).toBeCloseTo(6.020599913279624, 9);
  });

  it("drops by six dB when the wavelength doubles", () => {
    const short = calculateParabolicAntennaGain({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.03,
    }).parabolicGainDbi;
    const long = calculateParabolicAntennaGain({
      dishDiameterMeters: 1,
      wavelengthMeters: 0.06,
    }).parabolicGainDbi;
    expect(short - long).toBeCloseTo(6.020599913279624, 9);
  });

  it("scales with ten times the base-ten logarithm of efficiency", () => {
    const half = calculateParabolicAntennaGain({
      dishDiameterMeters: 1,
      efficiencyFraction: 0.275,
      wavelengthMeters: 0.1,
    }).parabolicGainDbi;
    expect(half).toBeCloseTo(27.346624348825117 - 3.0102999566398, 9);
  });

  it("rejects non-positive diameter or wavelength", () => {
    expect(
      runParabolicAntennaGain({ dishDiameterMeters: 0, wavelengthMeters: 0.1 })
        .ok,
    ).toBe(false);
    expect(
      runParabolicAntennaGain({ dishDiameterMeters: 1, wavelengthMeters: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects efficiency at the boundaries zero and one", () => {
    expect(
      runParabolicAntennaGain({
        dishDiameterMeters: 1,
        efficiencyFraction: 0,
        wavelengthMeters: 0.1,
      }).ok,
    ).toBe(false);
    expect(
      runParabolicAntennaGain({
        dishDiameterMeters: 1,
        efficiencyFraction: 1,
        wavelengthMeters: 0.1,
      }).ok,
    ).toBe(false);
  });
});
