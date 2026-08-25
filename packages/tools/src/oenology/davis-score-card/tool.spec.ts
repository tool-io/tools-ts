import { describe, expect, it } from "vitest";
import {
  davisScoreCardExample,
  davisScoreCardTool,
  runDavisScoreCard,
} from "./tool.js";

describe("davisScoreCardTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runDavisScoreCard(davisScoreCardExample.input)).toEqual({
      ok: true,
      output: davisScoreCardExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(davisScoreCardExample))).toEqual(
      davisScoreCardExample,
    );
    expect(davisScoreCardTool.contractVersion).toBe(1);
    expect(davisScoreCardTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDavisScoreCard(null).ok).toBe(false);
    expect(
      runDavisScoreCard({ ...davisScoreCardExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });

  it("totals the complete ten-category card to twenty points", () => {
    expect(
      runDavisScoreCard({
        appearance: 2,
        aromaBouquet: 4,
        astringency: 2,
        body: 1,
        color: 2,
        flavor: 2,
        generalQuality: 2,
        sugar: 1,
        totalAcid: 2,
        volatileAcidity: 2,
      }),
    ).toEqual({
      ok: true,
      output: { recommendation: "superior", totalPoints: 20 },
    });
  });
});
