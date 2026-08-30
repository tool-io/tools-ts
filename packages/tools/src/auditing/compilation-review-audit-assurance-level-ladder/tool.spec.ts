import { describe, expect, it } from "vitest";
import {
  assuranceLevelExample,
  classifyAssuranceLevel,
  runAssuranceLevel,
} from "./tool.js";

describe("assurance level ladder", () => {
  it("reproduces its canonical example", () => {
    expect(runAssuranceLevel(assuranceLevelExample.input)).toEqual({
      ok: true,
      output: assuranceLevelExample.output,
    });
  });

  it.each([
    ["preparation", "no_assurance", false],
    ["compilation", "no_assurance", true],
    ["review", "limited", true],
    ["audit", "reasonable", true],
  ] as const)("maps %s correctly", (engagementType, assuranceLevel, report) => {
    expect(classifyAssuranceLevel({ engagementType })).toEqual({
      assuranceLevel,
      practitionerReportIssued: report,
    });
  });

  it("rejects an unsupported engagement type", () => {
    expect(runAssuranceLevel({ engagementType: "consulting" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "engagementType" }] },
      ok: false,
    });
  });
});
