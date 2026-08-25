import { describe, expect, it } from "vitest";
import {
  proteinStabilityBentotestExample,
  proteinStabilityBentotestTool,
  runProteinStabilityBentotest,
} from "./tool.js";

describe("proteinStabilityBentotestTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runProteinStabilityBentotest(proteinStabilityBentotestExample.input),
    ).toEqual({
      ok: true,
      output: proteinStabilityBentotestExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(proteinStabilityBentotestExample)),
    ).toEqual(proteinStabilityBentotestExample);
    expect(proteinStabilityBentotestTool.contractVersion).toBe(1);
    expect(proteinStabilityBentotestTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runProteinStabilityBentotest(null).ok).toBe(false);
    expect(
      runProteinStabilityBentotest({
        ...proteinStabilityBentotestExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
