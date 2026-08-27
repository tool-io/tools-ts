import { describe, expect, it } from "vitest";
import { runTherapeuticWindow } from "./tool.js";

describe("Therapeutic Window Width", () => {
  it("calculates a valid result", () =>
    expect(
      runTherapeuticWindow({
        effectiveThresholdMgdl: 8,
        toxicThresholdMgdl: 20,
      }),
    ).toEqual({
      ok: true,
      output: { windowWidth: 12 },
    }));
  it("supports fractional thresholds", () =>
    expect(
      runTherapeuticWindow({
        effectiveThresholdMgdl: 1.5,
        toxicThresholdMgdl: 4.2,
      }),
    ).toEqual({
      ok: true,
      output: { windowWidth: 2.7 },
    }));
  it("handles wide windows", () => {
    const result = runTherapeuticWindow({
      effectiveThresholdMgdl: 10,
      toxicThresholdMgdl: 500,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.windowWidth).toBe(490);
  });
  it("handles narrow windows just above equality", () => {
    const result = runTherapeuticWindow({
      effectiveThresholdMgdl: 10,
      toxicThresholdMgdl: 10.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.windowWidth).toBeCloseTo(0.5, 12);
  });
  it("rejects equal thresholds", () => {
    const result = runTherapeuticWindow({
      effectiveThresholdMgdl: 15,
      toxicThresholdMgdl: 15,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_thresholds");
  });
  it("rejects an inverted window", () => {
    const result = runTherapeuticWindow({
      effectiveThresholdMgdl: 20,
      toxicThresholdMgdl: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_thresholds");
  });
});
