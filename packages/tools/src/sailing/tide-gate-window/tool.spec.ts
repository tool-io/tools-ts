import { describe, expect, it } from "vitest";
import {
  calculateTideGateWindow,
  runTideGateWindow,
  tideGateWindowExample,
} from "./tool.js";

describe("Tide Gate Window Calculator", () => {
  it("publishes an executable example", () =>
    expect(runTideGateWindow(tideGateWindowExample.input)).toEqual({
      ok: true,
      output: tideGateWindowExample.output,
    }));

  it.each([
    [1, 8, 3, 0.2],
    [2, 6, 2, 0.5],
    [0.5, 10, 4, 0.08333333333333333],
    [3, 9, 0, 0.3333333333333333],
    [1, 5, 4.5, 2],
  ])(
    "calculates the transit hours through the gate",
    (gate, boat, adverse, expected) => {
      expect(calculateTideGateWindow(gate, boat, adverse)).toBe(expected);
    },
  );

  it("matches ground speed made good against the current", () => {
    const gate = 4;
    const boat = 7;
    const adverse = 3;
    expect(calculateTideGateWindow(gate, boat, adverse)).toBe(
      gate / (boat - adverse),
    );
  });

  it("transits instantly with zero distance", () => {
    expect(calculateTideGateWindow(0.000001, 5, 1)).not.toBeNull();
  });

  it.each([
    [1, 8, 8],
    [1, 8, 9],
    [2, 3, 5],
  ])("rejects currents at or above boat speed", (gate, boat, adverse) => {
    expect(calculateTideGateWindow(gate, boat, adverse)).toBeNull();
    const result = runTideGateWindow({
      gateDistanceNm: gate,
      boatSpeedKt: boat,
      adverseCurrentKt: adverse,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("gate_not_transitable");
  });

  it("reports invalid_distance for a non-positive gate distance", () => {
    const result = runTideGateWindow({
      gateDistanceNm: 0,
      boatSpeedKt: 8,
      adverseCurrentKt: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_distance");
  });

  it("reports invalid_speed for a non-positive boat speed", () => {
    const result = runTideGateWindow({
      gateDistanceNm: 1,
      boatSpeedKt: -2,
      adverseCurrentKt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("reports invalid_current for a negative adverse current", () => {
    expect(calculateTideGateWindow(1, 8, -1)).toBeNull();
    const result = runTideGateWindow({
      gateDistanceNm: 1,
      boatSpeedKt: 8,
      adverseCurrentKt: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_current");
  });

  it("rejects non-finite inputs", () => {
    const result = runTideGateWindow({
      gateDistanceNm: Number.NaN,
      boatSpeedKt: 8,
      adverseCurrentKt: 3,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runTideGateWindow({
      gateDistanceNm: 1,
      boatSpeedKt: 8,
      adverseCurrentKt: 3,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
