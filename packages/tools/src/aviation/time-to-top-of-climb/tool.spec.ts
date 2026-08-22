import { describe, expect, it } from "vitest";
import {
  calculateTimeToTopOfClimb,
  runTimeToTopOfClimb,
  timeToTopOfClimbExample,
} from "./tool.js";

describe("time to top of climb calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTimeToTopOfClimb(timeToTopOfClimbExample.input)).toEqual({
      ok: true,
      output: timeToTopOfClimbExample.output,
    });
  });

  it("equals altitude difference over rate of climb", () => {
    expect(
      calculateTimeToTopOfClimb({
        currentAltitudeFt: 2300,
        rateOfClimbFpm: 650,
        targetAltitudeFt: 12500,
      }),
    ).toEqual({ climbMinutes: (12500 - 2300) / 650 });
    expect(
      calculateTimeToTopOfClimb({
        currentAltitudeFt: 0,
        rateOfClimbFpm: 400,
        targetAltitudeFt: 8000,
      }),
    ).toEqual({ climbMinutes: 20 });
  });

  it("keeps raw results without rounding", () => {
    expect(
      calculateTimeToTopOfClimb({
        currentAltitudeFt: 1000,
        rateOfClimbFpm: 300,
        targetAltitudeFt: 1500,
      }),
    ).toEqual({ climbMinutes: 500 / 300 });
  });

  it("climbs from sea level", () => {
    expect(
      runTimeToTopOfClimb({
        currentAltitudeFt: 0,
        rateOfClimbFpm: 700,
        targetAltitudeFt: 7000,
      }),
    ).toEqual({
      ok: true,
      output: { climbMinutes: 10 },
    });
  });

  it("handles very slow climb rates", () => {
    expect(
      calculateTimeToTopOfClimb({
        currentAltitudeFt: 0,
        rateOfClimbFpm: 1,
        targetAltitudeFt: 5000,
      }),
    ).toEqual({ climbMinutes: 5000 });
  });

  it("rejects zero and negative rates through execution", () => {
    for (const bad of [-500, 0])
      expect(
        runTimeToTopOfClimb({
          currentAltitudeFt: 2000,
          rateOfClimbFpm: bad,
          targetAltitudeFt: 12000,
        }).ok,
      ).toBe(false);
  });

  it("rejects level flight with no_climb_required", () => {
    const result = runTimeToTopOfClimb({
      currentAltitudeFt: 8000,
      rateOfClimbFpm: 500,
      targetAltitudeFt: 8000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("no_climb_required");
  });

  it("rejects descents with no_climb_required", () => {
    const result = runTimeToTopOfClimb({
      currentAltitudeFt: 9000,
      rateOfClimbFpm: 500,
      targetAltitudeFt: 4000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("no_climb_required");
  });

  it("reports invalid_rate before no_climb_required when both fail", () => {
    const result = runTimeToTopOfClimb({
      currentAltitudeFt: 8000,
      rateOfClimbFpm: 0,
      targetAltitudeFt: 8000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_rate");
  });

  it("rejects negative altitudes through execution", () => {
    expect(
      runTimeToTopOfClimb({
        currentAltitudeFt: -1,
        rateOfClimbFpm: 500,
        targetAltitudeFt: 12000,
      }).ok,
    ).toBe(false);
    expect(
      runTimeToTopOfClimb({
        currentAltitudeFt: 2000,
        rateOfClimbFpm: 500,
        targetAltitudeFt: -5,
      }).ok,
    ).toBe(false);
  });

  it("scales linearly with altitude difference", () => {
    const base = calculateTimeToTopOfClimb({
      currentAltitudeFt: 1000,
      rateOfClimbFpm: 500,
      targetAltitudeFt: 6000,
    }).climbMinutes;
    expect(base * 2).toBe(20);
  });
});
