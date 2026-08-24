import { describe, expect, it } from "vitest";
import {
  calculateGravityFlowIndex,
  gravityFlowIndexRavensteinExample,
  gravityFlowIndexRavensteinTool,
  runGravityFlowIndexRavenstein,
} from "./tool.js";

describe("gravityFlowIndexRavensteinTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runGravityFlowIndexRavenstein(gravityFlowIndexRavensteinExample.input),
    ).toEqual({
      ok: true,
      output: gravityFlowIndexRavensteinExample.output,
    });
  });

  it("obeys inverse-square distance scaling and rejects zero distance", () => {
    const near = calculateGravityFlowIndex({
      destinationPopulation: 100,
      distanceKm: 10,
      originPopulation: 200,
    }).gravityFlowIndex;
    const far = calculateGravityFlowIndex({
      destinationPopulation: 100,
      distanceKm: 20,
      originPopulation: 200,
    }).gravityFlowIndex;
    expect(near / far).toBe(4);
    const result = runGravityFlowIndexRavenstein({
      destinationPopulation: 100,
      distanceKm: 0,
      originPopulation: 200,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("distanceKm");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(gravityFlowIndexRavensteinExample)),
    ).toEqual(gravityFlowIndexRavensteinExample);
    expect(gravityFlowIndexRavensteinTool.contractVersion).toBe(1);
    expect(gravityFlowIndexRavensteinTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGravityFlowIndexRavenstein(null).ok).toBe(false);
    expect(
      runGravityFlowIndexRavenstein({
        ...gravityFlowIndexRavensteinExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
