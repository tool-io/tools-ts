import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyStart: number;
  readonly surveyEnd: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly eligibleDuration: number;
  readonly surveyShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyStart: { type: "number" },
    surveyEnd: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["surveyStart", "surveyEnd", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    surveyShare: { type: "number" },
  },
  required: ["eligibleDuration", "surveyShare"],
} as const;
/** Half-open overlap with an explicitly supplied observation window; no species activity window is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyStart, surveyEnd, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(surveyEnd > surveyStart && windowEnd >= windowStart);
    return {
      eligibleDuration: Math.max(
        0,
        Math.min(surveyEnd, windowEnd) - Math.max(surveyStart, windowStart),
      ),
      surveyShare:
        Math.max(
          0,
          Math.min(surveyEnd, windowEnd) - Math.max(surveyStart, windowStart),
        ) /
        (surveyEnd - surveyStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyStart: 8, surveyEnd: 12, windowStart: 9, windowEnd: 11 },
  output: { eligibleDuration: 2, surveyShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const reptileSurveyBaskingWindowOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-survey-basking-window-overlap",
    title: "Reptile Survey Basking Window Overlap Tool",
    description:
      "Half-open overlap with an explicitly supplied observation window; no species activity window is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyStart: { type: "number" },
        surveyEnd: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["surveyStart", "surveyEnd", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        surveyShare: { type: "number" },
      },
      required: ["eligibleDuration", "surveyShare"],
    },
    ports: {
      inputs: [
        {
          id: "surveyStart",
          label: "Survey Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surveyEnd",
          label: "Survey End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        {
          id: "surveyShare",
          label: "Survey Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileSurveyBaskingWindowOverlapTool.execute;
export default reptileSurveyBaskingWindowOverlapTool;
