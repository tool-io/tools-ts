import { describe, expect, it } from "vitest";
import {
  automationDisplacementExample,
  modelAutomationDisplacementShare,
  runAutomationDisplacement,
} from "./tool.js";

describe("automation labor displacement share model", () => {
  it("reproduces its canonical example", () => {
    expect(
      runAutomationDisplacement(automationDisplacementExample.input),
    ).toEqual({
      ok: true,
      output: automationDisplacementExample.output,
    });
  });

  it("leaves only the non-automatable share unaffected", () => {
    expect(
      modelAutomationDisplacementShare({
        adoptionPercent: 0,
        automatableSharePercent: 80,
        executionPercent: 100,
      }),
    ).toEqual({
      displacedSharePercent: 0,
      retainedAtRiskSharePercent: 0,
      unaffectedSharePercent: 20,
    });
  });

  it("handles full displacement", () => {
    expect(
      modelAutomationDisplacementShare({
        adoptionPercent: 100,
        automatableSharePercent: 25,
        executionPercent: 100,
      }).displacedSharePercent,
    ).toBe(25);
  });

  it("rejects a percentage above 100", () => {
    expect(
      runAutomationDisplacement({
        adoptionPercent: 101,
        automatableSharePercent: 20,
        executionPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "adoptionPercent" }],
      },
      ok: false,
    });
  });
});
