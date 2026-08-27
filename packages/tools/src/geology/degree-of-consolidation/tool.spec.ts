import { describe, expect, it } from "vitest";
import {
  degreeOfConsolidationExample,
  runDegreeOfConsolidation,
} from "./tool.js";

describe("degree-of-consolidation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDegreeOfConsolidation(degreeOfConsolidationExample.input),
    ).toEqual({
      ok: true,
      output: degreeOfConsolidationExample.output,
    });
  });

  it("inverts the large-time branch", () => {
    const result = runDegreeOfConsolidation({ timeFactor: 0.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.degreeOfConsolidationPercent as number).toBe(
      76.3957419583837,
    );
  });

  it("rejects a time factor beyond the asymptote", () => {
    expect(runDegreeOfConsolidation({ timeFactor: 2 }).ok).toBe(false);
  });
});
