import { describe, expect, it } from "vitest";
import { runRmsCurrentFromPeak } from "./tool.js";
describe("RMS From Peak", () => {
  it("calculates a valid result", () =>
    expect(runRmsCurrentFromPeak({ peakCurrentA: 10 })).toEqual({
      ok: true,
      output: { rmsCurrentA: 7.071067811865475 },
    }));
  it("converts sqrt2 peak to unity", () =>
    expect(runRmsCurrentFromPeak({ peakCurrentA: 1.4142135623730951 })).toEqual(
      {
        ok: true,
        output: { rmsCurrentA: 1 },
      },
    ));
  it("allows zero peak current", () =>
    expect(runRmsCurrentFromPeak({ peakCurrentA: 0 })).toEqual({
      ok: true,
      output: { rmsCurrentA: 0 },
    }));
  it("rejects negative peak current", () => {
    const result = runRmsCurrentFromPeak({ peakCurrentA: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "peakCurrentA",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runRmsCurrentFromPeak({ peakCurrentA: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runRmsCurrentFromPeak({ peakCurrentA: 1, extra: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runRmsCurrentFromPeak({}).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runRmsCurrentFromPeak({ peakCurrentA: "10" }).ok).toBe(false));
});
