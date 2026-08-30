import { describe, expect, it } from "vitest";
import {
  assessBlockchainConfirmationReliability,
  blockchainConfirmationExample,
  runBlockchainConfirmation,
} from "./tool.js";

describe("blockchain direct confirmation reliability", () => {
  it("reproduces its canonical example", () => {
    expect(
      runBlockchainConfirmation(blockchainConfirmationExample.input),
    ).toEqual({
      ok: true,
      output: blockchainConfirmationExample.output,
    });
  });

  it("classifies all five facts as strong", () => {
    expect(
      assessBlockchainConfirmationReliability({
        addressVerified: true,
        confirmationFromIndependentSource: true,
        publicKeyVerified: true,
        reconciliationComplete: true,
        transactionFinalityEstablished: true,
      }).assessment,
    ).toBe("strong");
  });

  it("classifies two of five facts as weak", () => {
    expect(
      assessBlockchainConfirmationReliability({
        addressVerified: true,
        confirmationFromIndependentSource: true,
        publicKeyVerified: false,
        reconciliationComplete: false,
        transactionFinalityEstablished: false,
      }).assessment,
    ).toBe("weak");
  });

  it("rejects a malformed reliability fact", () => {
    expect(
      runBlockchainConfirmation({
        addressVerified: 1,
        confirmationFromIndependentSource: true,
        publicKeyVerified: true,
        reconciliationComplete: true,
        transactionFinalityEstablished: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "addressVerified" }] },
      ok: false,
    });
  });
});
