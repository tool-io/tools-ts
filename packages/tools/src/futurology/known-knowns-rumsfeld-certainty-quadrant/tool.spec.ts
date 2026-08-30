import { describe, expect, it } from "vitest";
import {
  classifyRumsfeldCertaintyQuadrants,
  certaintyQuadrantExample,
  runCertaintyQuadrant,
} from "./tool.js";

describe("known-knowns certainty quadrant", () => {
  it("reproduces its canonical example", () => {
    expect(runCertaintyQuadrant(certaintyQuadrantExample.input)).toEqual({
      ok: true,
      output: certaintyQuadrantExample.output,
    });
  });

  it("normalizes quadrant labels", () => {
    expect(
      classifyRumsfeldCertaintyQuadrants({
        statementClassifications: ["KNOWNUNKNOWNS", " knownUnknowns "],
      }).quadrantCounts,
    ).toEqual([0, 2, 0, 0]);
  });

  it("selects the first quadrant when counts tie", () => {
    expect(
      classifyRumsfeldCertaintyQuadrants({
        statementClassifications: ["unknownUnknowns", "knownKnowns"],
      }).dominantQuadrant,
    ).toBe("knownKnowns");
  });

  it("rejects an invalid quadrant label", () => {
    expect(
      runCertaintyQuadrant({ statementClassifications: ["probablyUnknown"] }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_certainty_quadrant",
            field: "statementClassifications.0",
          },
        ],
      },
      ok: false,
    });
  });
});
