import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyedArea: number;
  readonly markedArea: number;
  readonly unobservedArea: number;
  readonly uncertainArea: number;
};
export type Output = {
  readonly observedShare: number;
  readonly minimumWholeShare: number;
  readonly maximumWholeShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyedArea: { type: "number", exclusiveMinimum: 0 },
    markedArea: { type: "number", minimum: 0 },
    unobservedArea: { type: "number", minimum: 0 },
    uncertainArea: { type: "number", minimum: 0 },
  },
  required: ["surveyedArea", "markedArea", "unobservedArea", "uncertainArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedShare: { type: "number" },
    minimumWholeShare: { type: "number" },
    maximumWholeShare: { type: "number" },
  },
  required: ["observedShare", "minimumWholeShare", "maximumWholeShare"],
} as const;
/** Bound supplied observed-area coverage with explicit uncertain and unobserved areas. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyedArea, markedArea, unobservedArea, uncertainArea } = request;
  const compute = (): Output => {
    H.positive(surveyedArea);
    H.domain(
      markedArea >= 0 &&
        uncertainArea >= 0 &&
        markedArea + uncertainArea <= surveyedArea &&
        unobservedArea >= 0,
    );
    return {
      observedShare: markedArea / surveyedArea,
      minimumWholeShare: markedArea / (surveyedArea + unobservedArea),
      maximumWholeShare:
        (markedArea + uncertainArea + unobservedArea) /
        (surveyedArea + unobservedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surveyedArea: 100,
    markedArea: 20,
    unobservedArea: 50,
    uncertainArea: 10,
  },
  output: {
    observedShare: 0.2,
    minimumWholeShare: 0.13333333333333333,
    maximumWholeShare: 0.5333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const moldSurveyObservedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/mold-survey-observed-area-share",
    title: "Mold Survey Observed Area Share Tool",
    description:
      "Bound supplied observed-area coverage with explicit uncertain and unobserved areas.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyedArea: { type: "number", exclusiveMinimum: 0 },
        markedArea: { type: "number", minimum: 0 },
        unobservedArea: { type: "number", minimum: 0 },
        uncertainArea: { type: "number", minimum: 0 },
      },
      required: [
        "surveyedArea",
        "markedArea",
        "unobservedArea",
        "uncertainArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedShare: { type: "number" },
        minimumWholeShare: { type: "number" },
        maximumWholeShare: { type: "number" },
      },
      required: ["observedShare", "minimumWholeShare", "maximumWholeShare"],
    },
    ports: {
      inputs: [
        {
          id: "surveyedArea",
          label: "Surveyed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markedArea",
          label: "Marked Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unobservedArea",
          label: "Unobserved Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertainArea",
          label: "Uncertain Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedShare",
          label: "Observed Share",
          valueType: { type: "number" },
        },
        {
          id: "minimumWholeShare",
          label: "Minimum Whole Share",
          valueType: { type: "number" },
        },
        {
          id: "maximumWholeShare",
          label: "Maximum Whole Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moldSurveyObservedAreaShareTool.execute;
export default moldSurveyObservedAreaShareTool;
