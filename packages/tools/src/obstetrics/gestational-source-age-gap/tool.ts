import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDate: string;
  readonly evaluationDate: string;
  readonly sourceAgeDays: number;
  readonly independentReferenceDays: number;
};
export type Output = {
  readonly elapsedDays: number;
  readonly projectedAgeDays: number;
  readonly referenceGapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDate: { type: "string", maxLength: 8192 },
    evaluationDate: { type: "string", maxLength: 8192 },
    sourceAgeDays: { type: "integer", minimum: 0 },
    independentReferenceDays: { type: "integer", minimum: 0 },
  },
  required: [
    "sourceDate",
    "evaluationDate",
    "sourceAgeDays",
    "independentReferenceDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer" },
    projectedAgeDays: { type: "integer" },
    referenceGapDays: { type: "integer" },
  },
  required: ["elapsedDays", "projectedAgeDays", "referenceGapDays"],
} as const;
/** Compare explicitly supplied research age records and civil-date elapsed time; no dating or care rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceDate,
    evaluationDate,
    sourceAgeDays,
    independentReferenceDays,
  } = request;
  const compute = (): Output => {
    H.integer(sourceAgeDays, 0);
    H.integer(independentReferenceDays, 0);
    return (() => {
      const elapsedDays =
          (H.dateOnly(evaluationDate).getTime() -
            H.dateOnly(sourceDate).getTime()) /
          86400000,
        projectedAgeDays = sourceAgeDays + elapsedDays;
      return {
        elapsedDays,
        projectedAgeDays,
        referenceGapDays: projectedAgeDays - independentReferenceDays,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceDate: "2024-01-01",
    evaluationDate: "2024-01-08",
    sourceAgeDays: 100,
    independentReferenceDays: 105,
  },
  output: { elapsedDays: 7, projectedAgeDays: 107, referenceGapDays: 2 },
} satisfies ToolExample<Input, Output>;
export const gestationalSourceAgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/gestational-source-age-gap",
    title: "Gestational Source Age Gap Tool",
    description:
      "Compare explicitly supplied research age records and civil-date elapsed time; no dating or care rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDate: { type: "string", maxLength: 8192 },
        evaluationDate: { type: "string", maxLength: 8192 },
        sourceAgeDays: { type: "integer", minimum: 0 },
        independentReferenceDays: { type: "integer", minimum: 0 },
      },
      required: [
        "sourceDate",
        "evaluationDate",
        "sourceAgeDays",
        "independentReferenceDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer" },
        projectedAgeDays: { type: "integer" },
        referenceGapDays: { type: "integer" },
      },
      required: ["elapsedDays", "projectedAgeDays", "referenceGapDays"],
    },
    ports: {
      inputs: [
        {
          id: "sourceDate",
          label: "Source Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluationDate",
          label: "Evaluation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceAgeDays",
          label: "Source Age Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "independentReferenceDays",
          label: "Independent Reference Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          valueType: { type: "integer" },
        },
        {
          id: "projectedAgeDays",
          label: "Projected Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "referenceGapDays",
          label: "Reference Gap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gestationalSourceAgeGapTool.execute;
export default gestationalSourceAgeGapTool;
