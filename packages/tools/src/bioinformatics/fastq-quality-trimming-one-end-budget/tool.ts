import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scores: readonly number[];
  readonly threshold: number;
  readonly fromLeft: boolean;
};
export type Output = {
  readonly trimmed: number;
  readonly retained: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "integer" } },
    threshold: { type: "integer", minimum: 0, maximum: 93 },
    fromLeft: { type: "boolean" },
  },
  required: ["scores", "threshold", "fromLeft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trimmed: { type: "integer" },
    retained: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["trimmed", "retained"],
} as const;
/** Trim only the consecutive below-threshold quality run at one selected end; internal low scores are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores, threshold, fromLeft } = request;
  const compute = (): Output => {
    H.domain(scores.every((x) => x >= 0 && x <= 93));
    H.integer(threshold, 0, 93);
    let trimmed = 0;
    while (
      trimmed < scores.length &&
      scores[fromLeft ? trimmed : scores.length - 1 - trimmed] < threshold
    )
      trimmed++;
    return {
      trimmed,
      retained: fromLeft
        ? scores.slice(trimmed)
        : scores.slice(0, scores.length - trimmed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scores: [5, 10, 30, 4], threshold: 20, fromLeft: true },
  output: { trimmed: 2, retained: [30, 4] },
} satisfies ToolExample<Input, Output>;
export const fastqQualityTrimmingOneEndBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/fastq-quality-trimming-one-end-budget",
    title: "FASTQ Quality Trimming One End Budget Tool",
    description:
      "Trim only the consecutive below-threshold quality run at one selected end; internal low scores are retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: { type: "array", maxItems: 256, items: { type: "integer" } },
        threshold: { type: "integer", minimum: 0, maximum: 93 },
        fromLeft: { type: "boolean" },
      },
      required: ["scores", "threshold", "fromLeft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trimmed: { type: "integer" },
        retained: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["trimmed", "retained"],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fromLeft",
          label: "From Left",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "trimmed", label: "Trimmed", valueType: { type: "integer" } },
        {
          id: "retained",
          label: "Retained",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = fastqQualityTrimmingOneEndBudgetTool.execute;
export default fastqQualityTrimmingOneEndBudgetTool;
