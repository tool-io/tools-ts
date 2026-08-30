import { describe, expect, it } from "vitest";
import {
  assessGiftsHospitalityPolicy,
  giftsHospitalityExample,
  runGiftsHospitality,
} from "./tool.js";

describe("gifts and hospitality firm policy lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runGiftsHospitality(giftsHospitalityExample.input)).toEqual({
      ok: true,
      output: giftsHospitalityExample.output,
    });
  });

  it("accepts a threshold gift with approval", () => {
    expect(
      assessGiftsHospitalityPolicy({
        approvalDocumented: true,
        cash: false,
        giftValue: 100,
        policyThreshold: 100,
        recipientIsClientPersonnel: true,
      }).compliant,
    ).toBe(true);
  });

  it("does not require review for a subthreshold ordinary gift", () => {
    expect(
      assessGiftsHospitalityPolicy({
        approvalDocumented: false,
        cash: false,
        giftValue: 99,
        policyThreshold: 100,
        recipientIsClientPersonnel: true,
      }).policyReviewRequired,
    ).toBe(true);
  });

  it("rejects a negative gift value", () => {
    expect(
      runGiftsHospitality({
        approvalDocumented: false,
        cash: false,
        giftValue: -1,
        policyThreshold: 100,
        recipientIsClientPersonnel: false,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "giftValue" }] },
      ok: false,
    });
  });
});
