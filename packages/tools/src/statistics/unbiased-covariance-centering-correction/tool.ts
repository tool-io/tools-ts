import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly count: number;
  readonly sumX: number;
  readonly sumY: number;
  readonly sumXY: number;
};
export type Output = { readonly covariance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 2 },
    sumX: { type: "number" },
    sumY: { type: "number" },
    sumXY: { type: "number" },
  },
  required: ["count", "sumX", "sumY", "sumXY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { covariance: { type: "number" } },
  required: ["covariance"],
} as const;
/** Compute unbiased covariance centering correction from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { count, sumX, sumY, sumXY } = input;
  const compute = (): Output => {
    integer(count, 2);
    return { covariance: (sumXY - (sumX * sumY) / count) / (count - 1) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 3, sumX: 6, sumY: 12, sumXY: 28 },
  output: { covariance: 2 },
} satisfies ToolExample<Input, Output>;
export const unbiasedCovarianceCenteringCorrectionTool =
  defineSchemaCalculation<Input, Output>({
    id: "statistics/unbiased-covariance-centering-correction",
    title: "Unbiased Covariance Centering Correction Tool",
    description:
      "Compute unbiased covariance centering correction from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sumX",
          label: "Sum X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumY",
          label: "Sum Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumXY",
          label: "Sum XY",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "covariance",
          label: "Covariance",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = unbiasedCovarianceCenteringCorrectionTool.execute;
export default unbiasedCovarianceCenteringCorrectionTool;
