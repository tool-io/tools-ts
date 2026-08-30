import { describe, expect, it } from "vitest";
import {
  mixedDonorPartsExample,
  runMixedDonorParts,
  screenMixedDonorPartsEvidence,
} from "./tool.js";

describe("mixed donor-parts evidence screen", () => {
  it("reproduces the canonical confirmed-mixed-parts example", () => {
    expect(runMixedDonorParts(mixedDonorPartsExample.input)).toEqual({
      ok: true,
      output: mixedDonorPartsExample.output,
    });
  });

  it("supports a fully documented original configuration", () => {
    expect(
      screenMixedDonorPartsEvidence({
        confirmedDonorPartCount: 0,
        movementCaseIdentityConfirmed: true,
        movementSerialMatchesDocumentation: true,
        originalConfigurationFullyDocumented: true,
      }).classification,
    ).toBe("supportedOriginalConfiguration");
  });

  it("flags incomplete zero-donor identity evidence", () => {
    expect(
      screenMixedDonorPartsEvidence({
        confirmedDonorPartCount: 0,
        movementCaseIdentityConfirmed: true,
        movementSerialMatchesDocumentation: false,
        originalConfigurationFullyDocumented: true,
      }).classification,
    ).toBe("inconsistentIdentityEvidence");
  });

  it("does not call confirmed donor parts fraud", () => {
    expect(
      screenMixedDonorPartsEvidence({
        confirmedDonorPartCount: 2,
        movementCaseIdentityConfirmed: true,
        movementSerialMatchesDocumentation: true,
        originalConfigurationFullyDocumented: true,
      }).configurationCaution,
    ).toContain("does not by itself prove fraud");
  });

  it("rejects a negative donor-part count", () => {
    expect(
      runMixedDonorParts({
        confirmedDonorPartCount: -1,
        movementCaseIdentityConfirmed: false,
        movementSerialMatchesDocumentation: false,
        originalConfigurationFullyDocumented: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "confirmedDonorPartCount" }],
      },
      ok: false,
    });
  });
});
