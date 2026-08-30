import { describe, expect, it } from "vitest";
import {
  cpeRequirementExample,
  evaluateCpeRequirement,
  runCpeRequirement,
} from "./tool.js";

describe("CPE hour requirement lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runCpeRequirement(cpeRequirementExample.input)).toEqual({
      ok: true,
      output: cpeRequirementExample.output,
    });
  });

  it("reports completion at exact requirements", () => {
    expect(
      evaluateCpeRequirement({
        completedEthicsHours: 4,
        completedTotalHours: 20,
        requiredEthicsHours: 4,
        requiredTotalHours: 20,
      }).requirementMet,
    ).toBe(true);
  });

  it("reports ethics shortfall independently", () => {
    expect(
      evaluateCpeRequirement({
        completedEthicsHours: 2,
        completedTotalHours: 20,
        requiredEthicsHours: 4,
        requiredTotalHours: 20,
      }),
    ).toMatchObject({ ethicsComplete: false, ethicsShortfallHours: 2 });
  });

  it("rejects negative required hours", () => {
    expect(
      runCpeRequirement({
        completedEthicsHours: 1,
        completedTotalHours: 1,
        requiredEthicsHours: -1,
        requiredTotalHours: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "requiredEthicsHours" }],
      },
      ok: false,
    });
  });
});
