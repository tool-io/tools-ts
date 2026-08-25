import { describe, expect, it } from "vitest";
import {
  blindTastingVarietalScorerExample,
  blindTastingVarietalScorerTool,
  runBlindTastingVarietalScorer,
} from "./tool.js";

describe("blindTastingVarietalScorerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runBlindTastingVarietalScorer(blindTastingVarietalScorerExample.input),
    ).toEqual({
      ok: true,
      output: blindTastingVarietalScorerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(blindTastingVarietalScorerExample)),
    ).toEqual(blindTastingVarietalScorerExample);
    expect(blindTastingVarietalScorerTool.contractVersion).toBe(1);
    expect(blindTastingVarietalScorerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBlindTastingVarietalScorer(null).ok).toBe(false);
    expect(
      runBlindTastingVarietalScorer({
        ...blindTastingVarietalScorerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("includes partial credit in the score percentage", () => {
    expect(
      runBlindTastingVarietalScorer({
        flightSize: 4,
        partialCreditPoints: 5,
        pointsPerCorrect: 10,
        varietalsCorrect: 2,
      }),
    ).toEqual({ ok: true, output: { score: 25, scorePercent: 62.5 } });
  });
});
