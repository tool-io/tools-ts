import { describe, expect, it } from "vitest";
import {
  checkConfirmationProcessControls,
  confirmationProcessExample,
  runConfirmationProcess,
} from "./tool.js";

describe("external confirmation process control checklist", () => {
  it("reproduces its canonical example", () => {
    expect(runConfirmationProcess(confirmationProcessExample.input)).toEqual({
      ok: true,
      output: confirmationProcessExample.output,
    });
  });

  it("reports a complete process", () => {
    expect(
      checkConfirmationProcessControls({
        addressesVerified: true,
        authorizationObtained: true,
        exceptionsResolved: true,
        independenceConfirmed: true,
        responsesTracked: true,
      }).complete,
    ).toBe(true);
  });

  it("reports missing controls in stable order", () => {
    expect(
      checkConfirmationProcessControls({
        addressesVerified: false,
        authorizationObtained: true,
        exceptionsResolved: false,
        independenceConfirmed: true,
        responsesTracked: true,
      }).missingControls,
    ).toEqual(["addresses verified", "exceptions resolved"]);
  });

  it("rejects a malformed control fact", () => {
    expect(
      runConfirmationProcess({
        addressesVerified: 1,
        authorizationObtained: true,
        exceptionsResolved: true,
        independenceConfirmed: true,
        responsesTracked: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "addressesVerified" }],
      },
      ok: false,
    });
  });
});
