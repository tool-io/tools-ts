import { describe, expect, it } from "vitest";
import {
  bankConfirmationFieldsExample,
  checkBankConfirmationFields,
  runBankConfirmationFields,
} from "./tool.js";

describe("bank confirmation standard fields", () => {
  it("reproduces its canonical example", () => {
    expect(
      runBankConfirmationFields(bankConfirmationFieldsExample.input),
    ).toEqual({
      ok: true,
      output: bankConfirmationFieldsExample.output,
    });
  });

  it("accepts all confirmation fields", () => {
    expect(
      checkBankConfirmationFields({
        accountNumberConfirmed: true,
        authorizedSignerConfirmed: true,
        balanceConfirmed: true,
        bankAddressVerified: true,
        bankContactIndependent: true,
      }).complete,
    ).toBe(true);
  });

  it("reports multiple missing fields in stable order", () => {
    expect(
      checkBankConfirmationFields({
        accountNumberConfirmed: false,
        authorizedSignerConfirmed: true,
        balanceConfirmed: false,
        bankAddressVerified: true,
        bankContactIndependent: true,
      }).missingFields,
    ).toEqual(["account number", "balance"]);
  });

  it("rejects a non-boolean field status", () => {
    expect(
      runBankConfirmationFields({
        accountNumberConfirmed: 1,
        authorizedSignerConfirmed: true,
        balanceConfirmed: true,
        bankAddressVerified: true,
        bankContactIndependent: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "accountNumberConfirmed" }],
      },
      ok: false,
    });
  });
});
