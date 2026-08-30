import { describe, expect, it } from "vitest";
import {
  checkWrittenRepresentationLetter,
  runWrittenRepresentation,
  writtenRepresentationExample,
} from "./tool.js";

describe("written representation required items", () => {
  it("reproduces its canonical example", () => {
    expect(
      runWrittenRepresentation(writtenRepresentationExample.input),
    ).toEqual({
      ok: true,
      output: writtenRepresentationExample.output,
    });
  });

  it("accepts a complete signed letter", () => {
    expect(
      checkWrittenRepresentationLetter({
        addressedAllFraud: true,
        addressedAllLegalMatters: true,
        confirmedFinancialStatementCompleteness: true,
        confirmedManagementResponsibilities: true,
        signed: true,
      }).complete,
    ).toBe(true);
  });

  it("lists missing items in stable order", () => {
    expect(
      checkWrittenRepresentationLetter({
        addressedAllFraud: false,
        addressedAllLegalMatters: true,
        confirmedFinancialStatementCompleteness: false,
        confirmedManagementResponsibilities: true,
        signed: true,
      }).missingItems,
    ).toEqual(["financial statement completeness", "fraud"]);
  });

  it("rejects a non-boolean item status", () => {
    expect(
      runWrittenRepresentation({
        addressedAllFraud: 1,
        addressedAllLegalMatters: true,
        confirmedFinancialStatementCompleteness: true,
        confirmedManagementResponsibilities: true,
        signed: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "addressedAllFraud" }],
      },
      ok: false,
    });
  });
});
