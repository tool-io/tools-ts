import { describe, expect, it } from "vitest";
import {
  nextNormalSorterExample,
  runNextNormalSorter,
  sortNextNormalAccelerationPermanence,
} from "./tool.js";

describe("next normal acceleration permanence sorter", () => {
  it("reproduces its canonical example", () => {
    expect(runNextNormalSorter(nextNormalSorterExample.input)).toEqual({
      ok: true,
      output: nextNormalSorterExample.output,
    });
  });

  it("sorts low persistence as temporary acceleration", () => {
    expect(
      sortNextNormalAccelerationPermanence({
        behaviorPersistenceScore: 20,
        digitalDependencyScore: 30,
        institutionalPersistenceScore: 10,
        nextNormalMinimumPercent: 75,
        temporaryMaximumPercent: 50,
      }).sortedCategory,
    ).toBe("temporaryAcceleration");
  });

  it("sorts middle persistence as reversible acceleration", () => {
    expect(
      sortNextNormalAccelerationPermanence({
        behaviorPersistenceScore: 60,
        digitalDependencyScore: 60,
        institutionalPersistenceScore: 60,
        nextNormalMinimumPercent: 75,
        temporaryMaximumPercent: 50,
      }).sortedCategory,
    ).toBe("reversibleAcceleration");
  });

  it("rejects overlapping permanence thresholds", () => {
    expect(
      runNextNormalSorter({
        behaviorPersistenceScore: 60,
        digitalDependencyScore: 60,
        institutionalPersistenceScore: 60,
        nextNormalMinimumPercent: 40,
        temporaryMaximumPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_permanence_thresholds",
            field: "nextNormalMinimumPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
