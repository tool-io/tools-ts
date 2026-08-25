import { describe, expect, it } from "vitest";
import {
  stuckFermentFlagExample,
  stuckFermentFlagTool,
  runStuckFermentFlag,
} from "./tool.js";

describe("stuckFermentFlagTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runStuckFermentFlag(stuckFermentFlagExample.input)).toEqual({
      ok: true,
      output: stuckFermentFlagExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(stuckFermentFlagExample))).toEqual(
      stuckFermentFlagExample,
    );
    expect(stuckFermentFlagTool.contractVersion).toBe(1);
    expect(stuckFermentFlagTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runStuckFermentFlag(null).ok).toBe(false);
    expect(
      runStuckFermentFlag({
        ...stuckFermentFlagExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("stuck ferment flag boundaries", () => {
  it("stays clear for dry wine", () => {
    const result = runStuckFermentFlag({
      currentSg: 0.991,
      residualSugarGPerL: 2,
      stuckResidualThresholdGPerL: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.stuckFermentation).toBe(false);
  });

  it("flags high residual sugar above dryness", () => {
    const result = runStuckFermentFlag({
      currentSg: 1.02,
      residualSugarGPerL: 40,
      stuckResidualThresholdGPerL: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.stuckFermentation).toBe(true);
  });
});
