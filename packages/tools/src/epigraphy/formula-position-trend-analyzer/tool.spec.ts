import { describe, expect, it } from "vitest";
import {
  formulaPositionTrendAnalyzerExample,
  runFormulaPositionTrendAnalyzer,
} from "./tool.js";

describe("formula-position-trend-analyzer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFormulaPositionTrendAnalyzer(
        formulaPositionTrendAnalyzerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: formulaPositionTrendAnalyzerExample.output,
    });
  });

  it("labels late occurrences terminal", () => {
    const r = runFormulaPositionTrendAnalyzer({
      corpusLines: ["aaaaaaaaaaaaa manibus"],
      formulaWord: "manibus",
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.meanPosition as number).toBe(14 / 21);
    expect(r.output.trend as string).toBe("terminal");
  });
  it("rejects corpora without the formula", () => {
    expect(
      runFormulaPositionTrendAnalyzer({
        corpusLines: ["nihil hic"],
        formulaWord: "manibus",
      }).ok,
    ).toBe(false);
  });
});
