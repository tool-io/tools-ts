import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const median = (values: ReadonlyArray<number>): number => {
  const sortedValues = [...values].sort((first, second) => first - second);
  const midpoint = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[midpoint - 1]! + sortedValues[midpoint]!) / 2
    : sortedValues[midpoint]!;
};

export type AgiSurveyMediansInput = {
  readonly forecastQuestionIds: ReadonlyArray<string>;
  readonly respondentMedianYears: ReadonlyArray<ReadonlyArray<number>>;
};

export type AgiSurveyMediansOutput = {
  readonly overallMedianYear: number;
  readonly questionMedianAssignments: ReadonlyArray<string>;
  readonly respondentCount: number;
};

export const summarizeAgiForecastSurveyMedians = (
  input: AgiSurveyMediansInput,
): AgiSurveyMediansOutput => {
  if (
    !Array.isArray(input.forecastQuestionIds) ||
    input.forecastQuestionIds.length === 0
  )
    simpleError(
      "forecastQuestionIds",
      "At least one forecast question is required.",
      "forecast_questions_required",
    );
  if (
    !Array.isArray(input.respondentMedianYears) ||
    input.respondentMedianYears.length !== input.forecastQuestionIds.length
  )
    simpleError(
      "respondentMedianYears",
      "Each forecast question must have one respondent-median row.",
      "respondent_medians_length_mismatch",
    );
  const questionIds = input.forecastQuestionIds.map((questionId, index) => {
    if (typeof questionId !== "string" || questionId.trim() === "")
      simpleError(
        `forecastQuestionIds.${index}`,
        "Forecast question IDs must be nonempty strings.",
        "invalid_forecast_question_id",
      );
    return questionId.trim();
  });
  if (new Set(questionIds).size !== questionIds.length)
    simpleError(
      "forecastQuestionIds",
      "Forecast question IDs must be unique.",
      "duplicate_forecast_question_id",
    );
  const allYears: number[] = [];
  const questionMedianAssignments: string[] = [];
  let respondentCount = 0;
  for (const [rowIndex, row] of input.respondentMedianYears.entries()) {
    if (!Array.isArray(row) || row.length === 0)
      simpleError(
        `respondentMedianYears.${rowIndex}`,
        "Each question needs at least one respondent median.",
        "respondent_medians_required",
      );
    for (const [columnIndex, year] of row.entries())
      if (!Number.isFinite(year) || year < 0)
        simpleError(
          `respondentMedianYears.${rowIndex}.${columnIndex}`,
          "Respondent medians must be finite and nonnegative years.",
          "invalid_respondent_median_year",
        );
    allYears.push(...row);
    respondentCount = Math.max(respondentCount, row.length);
    questionMedianAssignments.push(`${questionIds[rowIndex]}: ${median(row)}`);
  }
  const overallMedianYear = median(allYears);
  if (!Number.isFinite(overallMedianYear))
    simpleError("", "The overall median is not finite.", "result_not_finite");
  return { overallMedianYear, questionMedianAssignments, respondentCount };
};

export const agiSurveyMediansExample = {
  input: {
    forecastQuestionIds: ["agi-capability", "agi-takeoff"],
    respondentMedianYears: [
      [2040, 2050, 2060],
      [2035, 2045, 2055],
    ],
  },
  output: {
    overallMedianYear: 2047.5,
    questionMedianAssignments: ["agi-capability: 2050", "agi-takeoff: 2045"],
    respondentCount: 3,
  },
} satisfies ToolExample<AgiSurveyMediansInput, AgiSurveyMediansOutput>;

export const agiSurveyMediansTool = createSimpleTool({
  calculate: (input) =>
    summarizeAgiForecastSurveyMedians({
      forecastQuestionIds: input.forecastQuestionIds as string[],
      respondentMedianYears: input.respondentMedianYears as number[][],
    }),
  description:
    "Summarize caller-supplied AGI forecast respondent medians by question and across all responses.",
  id: "futurology/agi-forecast-survey-median-calculator",
  inputs: [
    {
      id: "forecastQuestionIds",
      kind: "stringList",
      label: "Forecast question IDs",
    },
    {
      description: "A question-by-respondent matrix of median forecast years.",
      id: "respondentMedianYears",
      kind: "matrix",
      label: "Respondent median years",
    },
  ],
  outputs: [
    {
      id: "overallMedianYear",
      kind: "number",
      label: "Overall median year",
      minimum: 0,
    },
    {
      id: "questionMedianAssignments",
      kind: "stringList",
      label: "Question median assignments",
    },
    {
      id: "respondentCount",
      kind: "integer",
      label: "Maximum respondents per question",
      minimum: 1,
    },
  ],
  title: "AGI Forecast Survey Median Calculator",
});

export const runAgiSurveyMedians = agiSurveyMediansTool.execute;
export default agiSurveyMediansTool;
