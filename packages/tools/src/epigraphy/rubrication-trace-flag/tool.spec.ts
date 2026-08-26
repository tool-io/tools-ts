import { describe, expect, it } from "vitest";
import {
  rubricationTraceFlagExample,
  runRubricationTraceFlag,
} from "./tool.js";

describe("rubrication-trace-flag", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRubricationTraceFlag(rubricationTraceFlagExample.input)).toEqual({
      ok: true,
      output: rubricationTraceFlagExample.output,
    });
  });

  it("does not flag non-red residue", () => {
    const result = runRubricationTraceFlag({
      residuePresent: true,
      hueCategory: "non-red",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rubricationSuspected as boolean).toBe(false);
  });

  it("rejects an unknown hue category", () => {
    expect(
      runRubricationTraceFlag({
        residuePresent: true,
        hueCategory: "blue",
      }).ok,
    ).toBe(false);
  });
});
