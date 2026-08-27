import { describe, expect, it } from "vitest";
import { runPrimerEfficiencyFromSlope } from "./tool.js";

describe("Primer Efficiency From Slope", () => {
  it("converts a typical standard curve slope", () =>
    expect(runPrimerEfficiencyFromSlope({ slope: -3.32 })).toEqual({
      ok: true,
      output: { efficiencyPercent: 100.08052545562056 },
    }));
  it("converts a steep slope below ideal efficiency", () =>
    expect(runPrimerEfficiencyFromSlope({ slope: -5 })).toEqual({
      ok: true,
      output: { efficiencyPercent: 58.48931924611136 },
    }));
  it("converts a shallow slope above ideal efficiency", () =>
    expect(runPrimerEfficiencyFromSlope({ slope: -2 })).toEqual({
      ok: true,
      output: { efficiencyPercent: 216.22776601683796 },
    }));
  it("maps the unit slope to nine hundred percent", () =>
    expect(runPrimerEfficiencyFromSlope({ slope: -1 })).toEqual({
      ok: true,
      output: { efficiencyPercent: 900 },
    }));
  it("rejects a zero slope", () => {
    const result = runPrimerEfficiencyFromSlope({ slope: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_slope");
  });
  it("rejects a positive slope", () => {
    const result = runPrimerEfficiencyFromSlope({ slope: 3.32 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_slope");
  });
});
