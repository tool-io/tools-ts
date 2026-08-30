import { describe, expect, it } from "vitest";
import {
  agiSurveyMediansExample,
  runAgiSurveyMedians,
  summarizeAgiForecastSurveyMedians,
} from "./tool.js";

describe("AGI forecast survey medians lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runAgiSurveyMedians(agiSurveyMediansExample.input)).toEqual({
      ok: true,
      output: agiSurveyMediansExample.output,
    });
  });

  it("calculates an even-count question median", () => {
    expect(
      summarizeAgiForecastSurveyMedians({
        forecastQuestionIds: ["Q"],
        respondentMedianYears: [[2030, 2040]],
      }).questionMedianAssignments,
    ).toEqual(["Q: 2035"]);
  });

  it("uses the largest row when rows have different lengths", () => {
    expect(
      summarizeAgiForecastSurveyMedians({
        forecastQuestionIds: ["A", "B"],
        respondentMedianYears: [[2030], [2020, 2030, 2040]],
      }).respondentCount,
    ).toBe(3);
  });

  it("rejects a negative respondent median", () => {
    expect(
      runAgiSurveyMedians({
        forecastQuestionIds: ["Q"],
        respondentMedianYears: [[-1]],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_respondent_median_year",
            field: "respondentMedianYears.0.0",
          },
        ],
      },
      ok: false,
    });
  });
});
