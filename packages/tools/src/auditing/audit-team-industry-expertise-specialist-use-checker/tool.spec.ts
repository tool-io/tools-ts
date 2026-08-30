import { describe, expect, it } from "vitest";
import {
  auditTeamExpertiseExample,
  countAuditTeamIndustrySpecialists,
  runAuditTeamExpertise,
} from "./tool.js";

describe("audit team industry expertise specialist checker", () => {
  it("reproduces its canonical example", () => {
    expect(runAuditTeamExpertise(auditTeamExpertiseExample.input)).toEqual({
      ok: true,
      output: auditTeamExpertiseExample.output,
    });
  });

  it("matches industry labels without case sensitivity", () => {
    expect(
      countAuditTeamIndustrySpecialists({
        minimumSpecialists: 1,
        requiredIndustry: " Healthcare ",
        teamIndustries: ["healthcare"],
      }),
    ).toEqual({
      qualifiedSpecialists: 1,
      requirementMet: true,
      teamMembers: 1,
    });
  });

  it("fails when no team member has the required expertise", () => {
    expect(
      countAuditTeamIndustrySpecialists({
        minimumSpecialists: 1,
        requiredIndustry: "Energy",
        teamIndustries: ["Technology"],
      }).requirementMet,
    ).toBe(false);
  });

  it("rejects a negative specialist minimum", () => {
    expect(
      runAuditTeamExpertise({
        minimumSpecialists: -1,
        requiredIndustry: "Energy",
        teamIndustries: [],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });
});
