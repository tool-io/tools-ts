import { describe, expect, it } from "vitest";
import { archetypalAnalysisExample, runArchetypalAnalysis } from "./tool.js";
describe("archetypal analysis", () => {
  it("publishes an executable example", () =>
    expect(runArchetypalAnalysis(archetypalAnalysisExample.input)).toEqual({
      ok: true,
      output: archetypalAnalysisExample.output,
    }));
});
