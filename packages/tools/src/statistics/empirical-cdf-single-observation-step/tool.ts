import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly observation: number;
  readonly evaluation: number;
  readonly sampleSize: number;
  readonly strict: boolean;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observation: { type: "number" },
    evaluation: { type: "number" },
    sampleSize: { type: "integer", minimum: 1 },
    strict: { type: "boolean" },
  },
  required: ["observation", "evaluation", "sampleSize", "strict"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute empirical cdf single observation step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { observation, evaluation, sampleSize, strict } = input;
  const compute = (): Output => {
    integer(sampleSize, 1);
    return {
      contribution: (
        strict ? observation < evaluation : observation <= evaluation
      )
        ? 1 / sampleSize
        : 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { observation: 2, evaluation: 2, sampleSize: 4, strict: false },
  output: { contribution: 0.25 },
} satisfies ToolExample<Input, Output>;
export const empiricalCdfSingleObservationStepTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/empirical-cdf-single-observation-step",
  title: "Empirical Cdf Single Observation Step Tool",
  description:
    "Compute empirical cdf single observation step from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "observation",
        label: "Observation",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "evaluation",
        label: "Evaluation",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "sampleSize",
        label: "Sample Size",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "strict",
        label: "Strict",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "contribution",
        label: "Contribution",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = empiricalCdfSingleObservationStepTool.execute;
export default empiricalCdfSingleObservationStepTool;
