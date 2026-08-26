import { describe, expect, it } from "vitest";
import {
  calculateTimeToStartLine,
  runTimeToStartLine,
  timeToStartLineExample,
} from "./tool.js";

describe("Time to Start Line Calculator", () => {
  it("publishes an executable example", () =>
    expect(runTimeToStartLine(timeToStartLineExample.input)).toEqual({
      ok: true,
      output: timeToStartLineExample.output,
    }));

  it.each([
    [0.5, 6, 5],
    [1, 12, 5],
    [0.25, 5, 3],
    [2, 8, 15],
    [0.1, 6, 1],
  ])("calculates the time to the start line", (distance, speed, expected) => {
    expect(calculateTimeToStartLine(distance, speed)).toBe(expected);
  });

  it("takes longer at lower speeds", () => {
    expect(calculateTimeToStartLine(1, 3)!).toBeGreaterThan(
      calculateTimeToStartLine(1, 6)!,
    );
  });

  it.each([
    [0, 6],
    [-0.5, 6],
    [0.5, 0],
    [0.5, -3],
  ])("rejects non-positive distance or speed", (distance, speed) => {
    expect(calculateTimeToStartLine(distance, speed)).toBeNull();
    const result = runTimeToStartLine({
      distanceToLineNm: distance,
      boatSpeedKt: speed,
    });
    expect(result.ok).toBe(false);
  });

  it("reports invalid_distance for a non-positive distance", () => {
    const result = runTimeToStartLine({ distanceToLineNm: 0, boatSpeedKt: 6 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("reports invalid_speed for a non-positive speed", () => {
    const result = runTimeToStartLine({
      distanceToLineNm: 0.5,
      boatSpeedKt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("rejects non-finite inputs", () => {
    const result = runTimeToStartLine({
      distanceToLineNm: Number.NaN,
      boatSpeedKt: 6,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runTimeToStartLine({
      distanceToLineNm: 0.5,
      boatSpeedKt: 6,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
