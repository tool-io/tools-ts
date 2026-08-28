import { describe, expect, it } from "vitest";
import { runPeakCurrentFromRms } from "./tool.js";
describe("Peak From RMS", () => {
  it("calculates a valid result", () =>
    expect(runPeakCurrentFromRms({ rmsCurrentA: 10 })).toEqual({
      ok: true,
      output: { peakCurrentA: 14.142135623730951 },
    }));
  it("converts unity rms to sqrt2 peak", () =>
    expect(runPeakCurrentFromRms({ rmsCurrentA: 1 })).toEqual({
      ok: true,
      output: { peakCurrentA: Math.SQRT2 },
    }));
  it("allows zero rms current", () =>
    expect(runPeakCurrentFromRms({ rmsCurrentA: 0 })).toEqual({
      ok: true,
      output: { peakCurrentA: 0 },
    }));
  it("supports negative rms current", () =>
    expect(runPeakCurrentFromRms({ rmsCurrentA: -1 }).ok).toBe(true));
  it("rejects non-finite input", () =>
    expect(
      runPeakCurrentFromRms({ rmsCurrentA: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runPeakCurrentFromRms({ extra: 2, rmsCurrentA: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runPeakCurrentFromRms({}).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runPeakCurrentFromRms({ rmsCurrentA: true }).ok).toBe(false));
});
