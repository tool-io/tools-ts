import { describe, expect, it } from "vitest";
import {
  calculateRateOfClimbFromGradient,
  runRateOfClimbFromGradient,
  rateOfClimbFromGradientExample,
} from "./tool.js";

describe("rate of climb from gradient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRateOfClimbFromGradient(rateOfClimbFromGradientExample.input),
    ).toEqual({
      ok: true,
      output: rateOfClimbFromGradientExample.output,
    });
  });

  it("applies the 101.26859142606666 ft/min per knot conversion", () => {
    expect(
      calculateRateOfClimbFromGradient({
        climbGradientPercent: 5,
        trueAirspeed: 150,
      }),
    ).toEqual({ rateOfClimbFpm: 150 * 101.26859142606666 * (5 / 100) });
  });

  it("handles a shallow one percent gradient", () => {
    expect(
      calculateRateOfClimbFromGradient({
        climbGradientPercent: 1,
        trueAirspeed: 90,
      }),
    ).toEqual({ rateOfClimbFpm: 90 * 101.26859142606666 * (1 / 100) });
  });

  it("accepts the fifteen percent upper bound through execution", () => {
    expect(
      runRateOfClimbFromGradient({
        climbGradientPercent: 15,
        trueAirspeed: 120,
      }),
    ).toEqual({
      ok: true,
      output: { rateOfClimbFpm: 120 * 101.26859142606666 * (15 / 100) },
    });
  });

  it("keeps raw results without rounding", () => {
    expect(
      calculateRateOfClimbFromGradient({
        climbGradientPercent: 2.5,
        trueAirspeed: 0.05,
      }),
    ).toEqual({ rateOfClimbFpm: 0.05 * 101.26859142606666 * (2.5 / 100) });
  });

  it("scales linearly with true airspeed", () => {
    const base = calculateRateOfClimbFromGradient({
      climbGradientPercent: 4,
      trueAirspeed: 80,
    }).rateOfClimbFpm;
    const doubled = calculateRateOfClimbFromGradient({
      climbGradientPercent: 4,
      trueAirspeed: 160,
    }).rateOfClimbFpm;
    expect(doubled).toBe(2 * base);
  });

  it("rejects gradients above fifteen percent through execution", () => {
    expect(
      runRateOfClimbFromGradient({
        climbGradientPercent: 15.1,
        trueAirspeed: 100,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero and negative gradients through execution", () => {
    for (const bad of [-3, 0])
      expect(
        runRateOfClimbFromGradient({
          climbGradientPercent: bad,
          trueAirspeed: 100,
        }).ok,
      ).toBe(false);
  });

  it("rejects zero and negative airspeeds through execution", () => {
    for (const bad of [-100, 0])
      expect(
        runRateOfClimbFromGradient({
          climbGradientPercent: 3,
          trueAirspeed: bad,
        }).ok,
      ).toBe(false);
  });

  it("reports stable error codes for invalid inputs", () => {
    const gradientResult = runRateOfClimbFromGradient({
      climbGradientPercent: 0,
      trueAirspeed: 100,
    });
    expect(gradientResult.ok).toBe(false);
    if (!gradientResult.ok)
      expect(gradientResult.error.issues[0]?.code).toBe("invalid_gradient");
    const speedResult = runRateOfClimbFromGradient({
      climbGradientPercent: 3,
      trueAirspeed: 0,
    });
    expect(speedResult.ok).toBe(false);
    if (!speedResult.ok)
      expect(speedResult.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("matches a large transport case", () => {
    expect(
      calculateRateOfClimbFromGradient({
        climbGradientPercent: 10,
        trueAirspeed: 210,
      }),
    ).toEqual({ rateOfClimbFpm: 210 * 101.26859142606666 * (10 / 100) });
  });
});
