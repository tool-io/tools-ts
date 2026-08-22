import { describe, expect, it } from "vitest";
import {
  calculateHoldingCircuitMinutes,
  holdingTimeExample,
  runHoldingTime,
} from "./tool.js";

describe("holding pattern time calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHoldingTime(holdingTimeExample.input)).toEqual({
      ok: true,
      output: holdingTimeExample.output,
    });
  });

  it("uses the classic four-minute circuit at standard values", () => {
    expect(
      calculateHoldingCircuitMinutes({
        inboundLegMinutes: 1,
        turnRateDegPerS: 3,
      }).circuitMinutes,
    ).toBe(4);
  });

  it("grows with longer legs and slower turns", () => {
    const longer = calculateHoldingCircuitMinutes({
      inboundLegMinutes: 1.5,
      turnRateDegPerS: 3,
    }).circuitMinutes;
    expect(longer).toBeGreaterThan(4);
    const slower = calculateHoldingCircuitMinutes({
      inboundLegMinutes: 1,
      turnRateDegPerS: 2,
    }).circuitMinutes;
    expect(slower).toBeGreaterThan(4);
  });

  it("rejects invalid legs and rates through execution", () => {
    for (const bad of [
      { inboundLegMinutes: 0, turnRateDegPerS: 3 },
      { inboundLegMinutes: 1, turnRateDegPerS: -3 },
    ])
      expect(runHoldingTime(bad as never).ok).toBe(false);
  });
});
