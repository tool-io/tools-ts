import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly surveyLegDistances: readonly number[] };
export type Output = {
  readonly totalSurveyDistance: number;
  readonly legCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyLegDistances: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["surveyLegDistances"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSurveyDistance: { type: "number" },
    legCount: { type: "integer" },
  },
  required: ["totalSurveyDistance", "legCount"],
} as const;
/** Sum explicitly supplied road-survey leg distances and count legs without deducing detection effort from route geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyLegDistances } = request;
  const compute = (): Output => {
    surveyLegDistances.forEach((value) =>
      H.domain(value >= 0, "surveyLegDistances"),
    );
    return {
      totalSurveyDistance: surveyLegDistances.reduce(
        (sum, value) => sum + value,
        0,
      ),
      legCount: surveyLegDistances.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyLegDistances: [2, 3, 1.5] },
  output: { totalSurveyDistance: 6.5, legCount: 3 },
} satisfies ToolExample<Input, Output>;
export const herpetofaunaRoadSurveyEffortDistanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/herpetofauna-road-survey-effort-distance",
      title: "Herpetofauna Road Survey Effort Distance Tool",
      description:
        "Sum explicitly supplied road-survey leg distances and count legs without deducing detection effort from route geometry.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surveyLegDistances: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["surveyLegDistances"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalSurveyDistance: { type: "number" },
          legCount: { type: "integer" },
        },
        required: ["totalSurveyDistance", "legCount"],
      },
      ports: {
        inputs: [
          {
            id: "surveyLegDistances",
            label: "Survey Leg Distances",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "totalSurveyDistance",
            label: "Total Survey Distance",
            valueType: { type: "number" },
          },
          {
            id: "legCount",
            label: "Leg Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = herpetofaunaRoadSurveyEffortDistanceTool.execute;
export default herpetofaunaRoadSurveyEffortDistanceTool;
