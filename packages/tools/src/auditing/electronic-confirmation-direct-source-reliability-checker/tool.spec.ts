import { describe, expect, it } from "vitest";
import {
  assessElectronicConfirmationReliability,
  electronicConfirmationReliabilityExample,
  runElectronicConfirmationReliability,
} from "./tool.js";

describe("electronic confirmation direct source reliability", () => {
  it("reproduces its canonical example", () => {
    expect(
      runElectronicConfirmationReliability(
        electronicConfirmationReliabilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: electronicConfirmationReliabilityExample.output,
    });
  });

  it("does not call a management portal strong even with all facts marked", () => {
    expect(
      assessElectronicConfirmationReliability({
        auditTrailCaptured: true,
        responseDirect: true,
        recipientVerified: true,
        senderIndependent: true,
        sourceType: "management_portal",
      }).assessment,
    ).toBe("conditional");
  });

  it("classifies one of four criteria as weak", () => {
    expect(
      assessElectronicConfirmationReliability({
        auditTrailCaptured: false,
        responseDirect: false,
        recipientVerified: false,
        senderIndependent: true,
        sourceType: "paper_mail",
      }),
    ).toMatchObject({ assessment: "weak", criteriaMet: 1 });
  });

  it("rejects an unsupported source type", () => {
    expect(
      runElectronicConfirmationReliability({
        auditTrailCaptured: true,
        responseDirect: true,
        recipientVerified: true,
        senderIndependent: true,
        sourceType: "carrier_pigeon",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "sourceType" }] },
      ok: false,
    });
  });
});
