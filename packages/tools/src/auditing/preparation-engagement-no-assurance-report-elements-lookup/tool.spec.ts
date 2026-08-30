import { describe, expect, it } from "vitest";
import {
  checkPreparationReportElements,
  preparationReportExample,
  runPreparationReport,
} from "./tool.js";

describe("preparation engagement report elements", () => {
  it("reproduces its canonical example", () => {
    expect(runPreparationReport(preparationReportExample.input)).toEqual({
      ok: true,
      output: preparationReportExample.output,
    });
  });

  it("accepts all selected report elements", () => {
    expect(
      checkPreparationReportElements({
        accountingResponsibilitiesIdentified: true,
        attachmentIdentified: true,
        disclaimerIncluded: true,
        noAssuranceStatementIncluded: true,
        signatureIncluded: true,
      }).complete,
    ).toBe(true);
  });

  it("lists multiple missing report elements", () => {
    expect(
      checkPreparationReportElements({
        accountingResponsibilitiesIdentified: false,
        attachmentIdentified: true,
        disclaimerIncluded: false,
        noAssuranceStatementIncluded: true,
        signatureIncluded: true,
      }).missingElements,
    ).toEqual(["accounting responsibilities", "disclaimer"]);
  });

  it("rejects a malformed report-element flag", () => {
    expect(
      runPreparationReport({
        accountingResponsibilitiesIdentified: 1,
        attachmentIdentified: true,
        disclaimerIncluded: true,
        noAssuranceStatementIncluded: true,
        signatureIncluded: true,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "accountingResponsibilitiesIdentified",
          },
        ],
      },
      ok: false,
    });
  });
});
