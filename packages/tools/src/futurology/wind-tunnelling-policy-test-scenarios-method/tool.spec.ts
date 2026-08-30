import { describe, expect, it } from "vitest";
import {
  generateWindTunnellingTests,
  runWindTunnelling,
  windTunnellingExample,
} from "./tool.js";

describe("wind-tunnelling policy test method", () => {
  it("reproduces its canonical example", () => {
    expect(runWindTunnelling(windTunnellingExample.input)).toEqual({
      ok: true,
      output: windTunnellingExample.output,
    });
  });

  it("crosses each stressor with each mechanism", () => {
    expect(
      generateWindTunnellingTests({
        policyGoal: "G",
        policyMechanisms: ["A", "B", "C"],
        stressors: ["X", "Y"],
      }).testCount,
    ).toBe(6);
  });

  it("preserves input order", () => {
    expect(
      generateWindTunnellingTests({
        policyGoal: "G",
        policyMechanisms: ["A", "B"],
        stressors: ["X"],
      }).testCases[0],
    ).toContain("A against X");
  });

  it("rejects an empty stressor list", () => {
    expect(
      runWindTunnelling({
        policyGoal: "G",
        policyMechanisms: ["A"],
        stressors: [],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "stressors_required", field: "stressors" }] },
      ok: false,
    });
  });
});
