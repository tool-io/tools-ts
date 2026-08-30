import { describe, expect, it } from "vitest";
import {
  checkThreeLinesRoleSeparation,
  runThreeLinesRoles,
  threeLinesRolesExample,
} from "./tool.js";

describe("three lines model role separation", () => {
  it("reproduces its canonical example", () => {
    expect(runThreeLinesRoles(threeLinesRolesExample.input)).toEqual({
      ok: true,
      output: threeLinesRolesExample.output,
    });
  });

  it("accepts distinct role assignments", () => {
    expect(
      checkThreeLinesRoleSeparation({
        assuranceFunctions: ["Assurance"],
        internalAuditFunctions: ["Audit"],
        managementFunctions: ["Operations"],
      }).segregationSatisfied,
    ).toBe(true);
  });

  it("detects an internal-audit and assurance overlap", () => {
    expect(
      checkThreeLinesRoleSeparation({
        assuranceFunctions: ["Audit"],
        internalAuditFunctions: ["Audit"],
        managementFunctions: [],
      }).overlaps,
    ).toEqual(["audit"]);
  });

  it("rejects a blank role label", () => {
    expect(
      runThreeLinesRoles({
        assuranceFunctions: [" "],
        internalAuditFunctions: [],
        managementFunctions: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_role", field: "assuranceFunctions.0" }],
      },
      ok: false,
    });
  });
});
