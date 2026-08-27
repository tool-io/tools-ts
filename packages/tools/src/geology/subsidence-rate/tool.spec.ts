import { describe, expect, it } from "vitest";
import { runSubsidenceRate, subsidenceRateExample } from "./tool.js";

describe("subsidence-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSubsidenceRate(subsidenceRateExample.input)).toEqual({
      ok: true,
      output: subsidenceRateExample.output,
    });
  });

  it("handles fractional durations", () => {
    const result = runSubsidenceRate({
      subsidenceAmountM: 90,
      durationMillionYears: 0.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.subsidenceRateMPerMillionYears as number).toBe(225);
  });

  it("rejects negative amounts and non-positive durations", () => {
    expect(
      runSubsidenceRate({ subsidenceAmountM: -5, durationMillionYears: 2 }).ok,
    ).toBe(false);
    expect(
      runSubsidenceRate({ subsidenceAmountM: 100, durationMillionYears: 0 }).ok,
    ).toBe(false);
  });
});
