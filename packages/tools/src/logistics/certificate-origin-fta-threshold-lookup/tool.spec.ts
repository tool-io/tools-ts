import { describe, expect, it } from "vitest";
import {
  calculateCertificateOriginFtaThresholdLookup,
  certificateOriginFtaThresholdLookupExample,
  runCertificateOriginFtaThresholdLookup,
} from "./tool.js";

describe("logistics/certificate-origin-fta-threshold-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCertificateOriginFtaThresholdLookup(
        certificateOriginFtaThresholdLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: certificateOriginFtaThresholdLookupExample.output,
    });
  });

  it("passes a small shortfall only within the de-minimis allowance", () => {
    const inside = runCertificateOriginFtaThresholdLookup({
      deMinimisAllowancePoints: 2,
      regionalValueContentPercent: 38.5,
      thresholdPercentRequired: 40,
    });
    const outside = runCertificateOriginFtaThresholdLookup({
      deMinimisAllowancePoints: 1,
      regionalValueContentPercent: 38.5,
      thresholdPercentRequired: 40,
    });
    if (!inside.ok || !outside.ok) throw new Error("expected success");
    expect(inside.output.basis).toBe("within_de_minimis");
    expect(inside.output.qualifies).toBe(true);
    expect(outside.output.basis).toBe("below_threshold");
  });

  it("rejects percentages above 100 via schema validation", () => {
    expect(
      runCertificateOriginFtaThresholdLookup({
        regionalValueContentPercent: 101,
        thresholdPercentRequired: 40,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite percentages in the direct API", () => {
    expect(() =>
      calculateCertificateOriginFtaThresholdLookup({
        regionalValueContentPercent: Number.NaN,
        thresholdPercentRequired: 40,
      }),
    ).toThrow("must be finite");
  });
});
