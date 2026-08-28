import { describe, expect, it } from "vitest";
import { sonarRangeEquationExample, runSonarRangeEquation } from "./tool.js";

const outputOf = (input: {
  soundSpeedMsPerS?: number;
  twoWayTravelSeconds: number;
}) => {
  const result = runSonarRangeEquation(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { sonarRangeMeters: number };
};

describe("Sonar Range Meters", () => {
  it("reproduces the canonical example with default sound speed", () =>
    expect(runSonarRangeEquation(sonarRangeEquationExample.input)).toEqual({
      ok: true,
      output: { sonarRangeMeters: 1480 },
    }));

  it("defaults to 1480 meters per second when speed omitted", () =>
    expect(runSonarRangeEquation({ twoWayTravelSeconds: 1 })).toEqual(
      runSonarRangeEquation({ soundSpeedMsPerS: 1480, twoWayTravelSeconds: 1 }),
    ));

  it("halves the two-way travel time into one-way distance", () => {
    const { sonarRangeMeters } = outputOf({
      soundSpeedMsPerS: 1500,
      twoWayTravelSeconds: 3.4,
    });
    expect(sonarRangeMeters).toBeCloseTo((1500 * 3.4) / 2, 12);
  });

  it("scales linearly with travel time", () => {
    const near = outputOf({ twoWayTravelSeconds: 0.5 }).sonarRangeMeters;
    const far = outputOf({ twoWayTravelSeconds: 1.5 }).sonarRangeMeters;
    expect(far).toBeCloseTo(near * 3, 12);
  });

  it("scales linearly with sound speed", () => {
    const fresh = outputOf({
      soundSpeedMsPerS: 1480,
      twoWayTravelSeconds: 2,
    }).sonarRangeMeters;
    const salt = outputOf({
      soundSpeedMsPerS: 1520,
      twoWayTravelSeconds: 2,
    }).sonarRangeMeters;
    expect(salt / fresh).toBeCloseTo(1520 / 1480, 12);
  });

  it("handles sub-second echoes", () =>
    expect(
      outputOf({ twoWayTravelSeconds: 0.02 }).sonarRangeMeters,
    ).toBeCloseTo(14.8, 12));

  it("rejects non-positive travel time", () => {
    expect(runSonarRangeEquation({ twoWayTravelSeconds: 0 }).ok).toBe(false);
    expect(runSonarRangeEquation({ twoWayTravelSeconds: -1 }).ok).toBe(false);
  });

  it("rejects non-positive sound speed override", () =>
    expect(
      runSonarRangeEquation({ soundSpeedMsPerS: 0, twoWayTravelSeconds: 1 }).ok,
    ).toBe(false));
});
