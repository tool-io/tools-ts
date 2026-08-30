import { describe, expect, it } from "vitest";
import {
  registerWildCards,
  runWildCardRegister,
  wildCardRegisterExample,
} from "./tool.js";

describe("low-probability high-impact wild cards", () => {
  it("reproduces its canonical example", () => {
    expect(runWildCardRegister(wildCardRegisterExample.input)).toEqual({
      ok: true,
      output: wildCardRegisterExample.output,
    });
  });

  it("includes probability and impact exactly at thresholds", () => {
    expect(
      registerWildCards({
        highImpactThreshold: 80,
        lowProbabilityThresholdPercent: 20,
        wildCardIds: ["Boundary"],
        wildCardMetrics: [[20, 80]],
      }).candidateIds,
    ).toEqual(["Boundary"]);
  });

  it("excludes high-probability events", () => {
    expect(
      registerWildCards({
        highImpactThreshold: 80,
        lowProbabilityThresholdPercent: 20,
        wildCardIds: ["Common"],
        wildCardMetrics: [[21, 100]],
      }).candidateCount,
    ).toBe(0);
  });

  it("rejects mismatched event arrays", () => {
    expect(
      runWildCardRegister({
        highImpactThreshold: 80,
        lowProbabilityThresholdPercent: 20,
        wildCardIds: [],
        wildCardMetrics: [[10, 90]],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "wild_card_data_length_mismatch", field: "wildCardMetrics" },
        ],
      },
      ok: false,
    });
  });
});
