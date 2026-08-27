import { describe, expect, it } from "vitest";
import {
  antennaRadiationEfficiency2Example,
  runAntennaRadiationEfficiency2,
} from "./tool.js";

const outputOf = (input: { directivityDbi: number; gainDbi: number }) => {
  const result = runAntennaRadiationEfficiency2(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { radiationEfficiencyPercent: number };
};

describe("Antenna Rad Efficiency 2", () => {
  it("reproduces the canonical example", () =>
    expect(
      runAntennaRadiationEfficiency2(antennaRadiationEfficiency2Example.input),
    ).toEqual({
      ok: true,
      output: { radiationEfficiencyPercent: 63.09573444801933 },
    }));

  it("matches the power-ratio conversion of the dB difference", () => {
    const { radiationEfficiencyPercent } = outputOf({
      directivityDbi: 9.5,
      gainDbi: 7.5,
    });
    expect(radiationEfficiencyPercent).toBeCloseTo(
      Math.pow(10, -2 / 10) * 100,
      12,
    );
  });

  it("reports one hundred percent for equal gain and directivity", () =>
    expect(
      outputOf({ directivityDbi: 15, gainDbi: 15 }).radiationEfficiencyPercent,
    ).toBeCloseTo(100, 12));

  it("drops ten percent for each tenth-of-dB deficit at small deficits", () => {
    const base = outputOf({
      directivityDbi: 20,
      gainDbi: 19,
    }).radiationEfficiencyPercent;
    expect(base).toBeCloseTo(Math.pow(10, -0.1) * 100, 12);
  });

  it("drops near half for a three dB deficit", () => {
    const base = outputOf({
      directivityDbi: 13,
      gainDbi: 10,
    }).radiationEfficiencyPercent;
    expect(base).toBeCloseTo(Math.pow(10, -0.3) * 100, 12);
    expect(base).toBeGreaterThan(49);
    expect(base).toBeLessThan(51);
  });

  it("scales exponentially with the deficit", () => {
    const one = outputOf({
      directivityDbi: 10,
      gainDbi: 9,
    }).radiationEfficiencyPercent;
    const two = outputOf({
      directivityDbi: 10,
      gainDbi: 8,
    }).radiationEfficiencyPercent;
    expect(two / one).toBeCloseTo(Math.pow(10, -0.1), 12);
  });

  it("rejects gain above directivity", () =>
    expect(
      runAntennaRadiationEfficiency2({ directivityDbi: 10, gainDbi: 11 }).ok,
    ).toBe(false));

  it("rejects non-finite inputs", () =>
    expect(
      runAntennaRadiationEfficiency2({
        directivityDbi: Number.POSITIVE_INFINITY,
        gainDbi: 1,
      } as unknown as { directivityDbi: number; gainDbi: number }).ok,
    ).toBe(false));
});
