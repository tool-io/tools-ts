import { describe, expect, it } from "vitest";
import {
  calculateHsCodeDutyRateLookup,
  hsCodeDutyRateLookupExample,
  runHsCodeDutyRateLookup,
} from "./tool.js";

describe("logistics/hs-code-duty-rate-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHsCodeDutyRateLookup(hsCodeDutyRateLookupExample.input)).toEqual({
      ok: true,
      output: hsCodeDutyRateLookupExample.output,
    });
  });

  it("prefers the supplied FTA rate over the general rate", () => {
    const result = runHsCodeDutyRateLookup({
      dutyRatePercentOverride: 20,
      hsCode: "640399",
      preferentialRatePercent: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.appliedDutyRatePercent as number).toBe(0);
    expect(result.output.rateSource).toBe("preferential");
  });

  it("rejects malformed codes", () => {
    expect(
      runHsCodeDutyRateLookup({ dutyRatePercentOverride: 16, hsCode: "61O91O" })
        .ok,
    ).toBe(false);
    expect(
      runHsCodeDutyRateLookup({ dutyRatePercentOverride: 16, hsCode: "6109" })
        .ok,
    ).toBe(false);
  });

  it("does not coerce a numeric code in the direct calculator", () => {
    expect(() =>
      calculateHsCodeDutyRateLookup({
        dutyRatePercentOverride: 16,
        hsCode: 610910 as unknown as string,
      }),
    ).toThrowError("hsCode must be 6 to 10 digits.");
  });
});
