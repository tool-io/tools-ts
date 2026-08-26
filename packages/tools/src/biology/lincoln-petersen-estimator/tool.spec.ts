import { describe, expect, it } from "vitest";
import { lincolnPetersenExample, runLincolnPetersen } from "./tool.js";

describe("Lincoln Petersen Estimator", () => {
  it("matches the canonical example", () => {
    expect(runLincolnPetersen(lincolnPetersenExample.input)).toEqual({
      ok: true,
      output: lincolnPetersenExample.output,
    });
  });

  it("computes an asymmetric two session estimate exactly", () => {
    expect(
      runLincolnPetersen({
        firstCaptureCount: 30,
        recapturedCount: 9,
        secondCaptureCount: 45,
      }),
    ).toEqual({ ok: true, output: { populationEstimate: 150 } });
  });

  it("computes a small population exactly", () => {
    expect(
      runLincolnPetersen({
        firstCaptureCount: 12,
        recapturedCount: 4,
        secondCaptureCount: 15,
      }),
    ).toEqual({ ok: true, output: { populationEstimate: 45 } });
  });

  it("produces a fractional estimate when the product is indivisible", () => {
    const result = runLincolnPetersen({
      firstCaptureCount: 41,
      recapturedCount: 3,
      secondCaptureCount: 25,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(Number(result.output.populationEstimate)).toBeCloseTo(
        341.6666666666667,
        10,
      );
  });

  it("rejects zero recaptures with a stable code", () => {
    const result = runLincolnPetersen({
      firstCaptureCount: 50,
      recapturedCount: 0,
      secondCaptureCount: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "zero_recaptures",
        field: "recapturedCount",
      });
  });

  it("rejects negative recaptures with a stable code", () => {
    const result = runLincolnPetersen({
      firstCaptureCount: 50,
      recapturedCount: -2,
      secondCaptureCount: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_recaptures");
  });

  it("rejects non positive and fractional capture counts through the schema", () => {
    expect(
      runLincolnPetersen({
        firstCaptureCount: 0,
        recapturedCount: 10,
        secondCaptureCount: 40,
      }).ok,
    ).toBe(false);
    expect(
      runLincolnPetersen({
        firstCaptureCount: 50.5,
        recapturedCount: 10,
        secondCaptureCount: 40,
      }).ok,
    ).toBe(false);
    expect(
      runLincolnPetersen({
        firstCaptureCount: 50,
        recapturedCount: 10,
        secondCaptureCount: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing required input", () => {
    const result = runLincolnPetersen({
      firstCaptureCount: 50,
      secondCaptureCount: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("recapturedCount");
  });
  it("rejects recaptures above either session count", () => {
    const result = runLincolnPetersen({
      firstCaptureCount: 10,
      recapturedCount: 11,
      secondCaptureCount: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_recaptures");
  });
});
