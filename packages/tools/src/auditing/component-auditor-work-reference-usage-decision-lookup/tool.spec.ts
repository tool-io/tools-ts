import { describe, expect, it } from "vitest";
import {
  componentAuditorWorkExample,
  decideComponentAuditorWorkUsage,
  runComponentAuditorWork,
} from "./tool.js";

describe("component auditor work usage decision", () => {
  it("reproduces its canonical example", () => {
    expect(runComponentAuditorWork(componentAuditorWorkExample.input)).toEqual({
      ok: true,
      output: componentAuditorWorkExample.output,
    });
  });

  it("requires additional work when both evidence conditions fail", () => {
    expect(
      decideComponentAuditorWorkUsage({
        componentAuditorWorkSufficient: false,
        groupAuditorObtainedEvidence: false,
        instructionsClear: true,
        materialComponent: true,
      }),
    ).toMatchObject({
      additionalGroupWorkRequired: true,
      decision: "additional_group_work",
    });
  });

  it("routes mixed evidence facts to professional judgment", () => {
    expect(
      decideComponentAuditorWorkUsage({
        componentAuditorWorkSufficient: true,
        groupAuditorObtainedEvidence: false,
        instructionsClear: true,
        materialComponent: false,
      }).decision,
    ).toBe("professional_judgment");
  });

  it("rejects a malformed work fact", () => {
    expect(
      runComponentAuditorWork({
        componentAuditorWorkSufficient: 1,
        groupAuditorObtainedEvidence: true,
        instructionsClear: true,
        materialComponent: true,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "componentAuditorWorkSufficient" },
        ],
      },
      ok: false,
    });
  });
});
