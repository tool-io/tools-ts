import { describe, expect, it } from "vitest";
import {
  camJurisdictionExample,
  evaluateCamJurisdictionRequirements,
  runCamJurisdiction,
} from "./tool.js";

describe("CAM jurisdiction crosswalk", () => {
  it("reproduces its canonical example", () => {
    expect(runCamJurisdiction(camJurisdictionExample.input)).toEqual({
      ok: true,
      output: camJurisdictionExample.output,
    });
  });

  it("allows a nonrequired CAM communication path when requirements are met", () => {
    expect(
      evaluateCamJurisdictionRequirements({
        auditorIndependent: true,
        basisForInclusion: "Audited financial statements",
        entityListed: false,
        jurisdictionRequiresCam: false,
        requirementsMet: true,
      }).canReport,
    ).toBe(true);
  });

  it("reports all missing required facts", () => {
    expect(
      evaluateCamJurisdictionRequirements({
        auditorIndependent: false,
        basisForInclusion: "Audited financial statements",
        entityListed: false,
        jurisdictionRequiresCam: true,
        requirementsMet: false,
      }).missingRequirements,
    ).toEqual([
      "entity_not_listed",
      "auditor_not_independent",
      "requirements_not_met",
    ]);
  });

  it("rejects a blank basis for inclusion", () => {
    expect(
      runCamJurisdiction({
        auditorIndependent: true,
        basisForInclusion: " ",
        entityListed: true,
        jurisdictionRequiresCam: true,
        requirementsMet: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "cam_basis_required", field: "basisForInclusion" }],
      },
      ok: false,
    });
  });
});
