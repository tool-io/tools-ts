import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly countsPerEvent: number };
export type Output = {
  readonly poissonSd: number;
  readonly relativeSd: number;
  readonly scaledSd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    countsPerEvent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "countsPerEvent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poissonSd: { type: "number" },
    relativeSd: { type: "number" },
    scaledSd: { type: "number" },
  },
  required: ["poissonSd", "relativeSd", "scaledSd"],
} as const;
/** Poisson counting standard error under independent-event sampling, not total instrument or clinical measurement uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, countsPerEvent } = request;
  const compute = (): Output => {
    H.integer(count, 1);
    H.positive(countsPerEvent);
    return {
      poissonSd: Math.sqrt(count),
      relativeSd: 1 / Math.sqrt(count),
      scaledSd: Math.sqrt(count) * countsPerEvent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 100, countsPerEvent: 2 },
  output: { poissonSd: 10, relativeSd: 0.1, scaledSd: 20 },
} satisfies ToolExample<Input, Output>;
export const analyzerCountingPoissonRelativeErrorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/analyzer-counting-poisson-relative-error",
      title: "Analyzer Counting Poisson Relative Error Tool",
      description:
        "Poisson counting standard error under independent-event sampling, not total instrument or clinical measurement uncertainty.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer", minimum: 1 },
          countsPerEvent: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["count", "countsPerEvent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          poissonSd: { type: "number" },
          relativeSd: { type: "number" },
          scaledSd: { type: "number" },
        },
        required: ["poissonSd", "relativeSd", "scaledSd"],
      },
      ports: {
        inputs: [
          {
            id: "count",
            label: "Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countsPerEvent",
            label: "Counts Per Event",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "poissonSd",
            label: "Poisson Sd",
            valueType: { type: "number" },
          },
          {
            id: "relativeSd",
            label: "Relative Sd",
            valueType: { type: "number" },
          },
          { id: "scaledSd", label: "Scaled Sd", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = analyzerCountingPoissonRelativeErrorTool.execute;
export default analyzerCountingPoissonRelativeErrorTool;
