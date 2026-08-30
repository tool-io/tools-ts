import { describe, expect, it } from "vitest";
import {
  divideGroupComponentMateriality,
  groupComponentMaterialityExample,
  runGroupComponentMateriality,
} from "./tool.js";

describe("group component materiality division", () => {
  it("reproduces its canonical example", () => {
    expect(
      runGroupComponentMateriality(groupComponentMaterialityExample.input),
    ).toEqual({
      ok: true,
      output: groupComponentMaterialityExample.output,
    });
  });

  it("allocates materiality by component share", () => {
    expect(
      divideGroupComponentMateriality({
        componentAuditorMateriality: 25_000,
        componentSharePercent: 25,
        groupMateriality: 100_000,
        instructionsPercent: 25,
        tolerance: 0,
      }).allocatedMateriality,
    ).toBe(25_000);
  });

  it("detects inconsistent component-auditor materiality", () => {
    expect(
      divideGroupComponentMateriality({
        componentAuditorMateriality: 30_000,
        componentSharePercent: 20,
        groupMateriality: 100_000,
        instructionsPercent: 20,
        tolerance: 100,
      }).allocationReconciles,
    ).toBe(false);
  });

  it("rejects zero group materiality", () => {
    expect(
      runGroupComponentMateriality({
        componentAuditorMateriality: 0,
        componentSharePercent: 20,
        groupMateriality: 0,
        instructionsPercent: 20,
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "zero_group_materiality", field: "groupMateriality" }],
      },
      ok: false,
    });
  });
});
