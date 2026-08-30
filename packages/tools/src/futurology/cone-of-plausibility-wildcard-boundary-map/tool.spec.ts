import { describe, expect, it } from "vitest";
import {
  mapPlausibilityConeBoundaries,
  plausibilityConeExample,
  runPlausibilityCone,
} from "./tool.js";

describe("cone of plausibility boundary map", () => {
  it("reproduces its canonical example", () => {
    expect(runPlausibilityCone(plausibilityConeExample.input)).toEqual({
      ok: true,
      output: plausibilityConeExample.output,
    });
  });

  it("includes exact low-plausibility and high-impact boundaries", () => {
    expect(
      mapPlausibilityConeBoundaries({
        highImpactThreshold: 80,
        lowPlausibilityThresholdPercent: 20,
        scenarioIds: ["Boundary"],
        scenarioMetrics: [[20, 80]],
        wildCardFlags: [1],
      }).outsideCount,
    ).toBe(1);
  });

  it("excludes scenarios inside the impact threshold", () => {
    expect(
      mapPlausibilityConeBoundaries({
        highImpactThreshold: 80,
        lowPlausibilityThresholdPercent: 20,
        scenarioIds: ["Low impact"],
        scenarioMetrics: [[10, 79]],
        wildCardFlags: [1],
      }).wildCardOutsideCount,
    ).toBe(0);
  });

  it("rejects mismatched scenario arrays", () => {
    expect(
      runPlausibilityCone({
        highImpactThreshold: 80,
        lowPlausibilityThresholdPercent: 20,
        scenarioIds: ["A"],
        scenarioMetrics: [[10, 90]],
        wildCardFlags: [],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "cone_data_length_mismatch", field: "scenarioMetrics" },
        ],
      },
      ok: false,
    });
  });
});
