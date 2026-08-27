import { describe, expect, it } from "vitest";
import { momentMagnitudeExample, runMomentMagnitude } from "./tool.js";

describe("moment-magnitude", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMomentMagnitude(momentMagnitudeExample.input)).toEqual({
      ok: true,
      output: momentMagnitudeExample.output,
    });
  });

  it("returns zero for the reference moment 10^9.1 N m", () => {
    const result = runMomentMagnitude({
      seismicMomentNewtonMeters: Math.pow(10, 9.1),
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.momentMagnitude as number).toBeCloseTo(0, 12);
  });
  it("rejects non-positive moments", () => {
    expect(runMomentMagnitude({ seismicMomentNewtonMeters: 0 }).ok).toBe(false);
  });
});
