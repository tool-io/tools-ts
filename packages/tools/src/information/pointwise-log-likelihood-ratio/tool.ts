import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProbability: number;
  readonly secondProbability: number;
  readonly logBase: number;
};
export type Output = { readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    secondProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    logBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["firstProbability", "secondProbability", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" } },
  required: ["logRatio"],
} as const;
/** Calculate pointwise log likelihood ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstProbability, secondProbability, logBase } = request;
  const compute = (): Output => {
    H.domain(
      firstProbability > 0 &&
        firstProbability <= 1 &&
        secondProbability > 0 &&
        secondProbability <= 1 &&
        logBase > 1,
    );
    return {
      logRatio:
        Math.log(firstProbability / secondProbability) / Math.log(logBase),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstProbability: 0.5, secondProbability: 0.125, logBase: 2 },
  output: { logRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const pointwiseLogLikelihoodRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/pointwise-log-likelihood-ratio",
    title: "Pointwise Log Likelihood Ratio Tool",
    description:
      "Calculate pointwise log likelihood ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        secondProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        logBase: { type: "number", exclusiveMinimum: 1 },
      },
      required: ["firstProbability", "secondProbability", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" } },
      required: ["logRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstProbability",
          label: "First Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondProbability",
          label: "Second Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pointwiseLogLikelihoodRatioTool.execute;
export default pointwiseLogLikelihoodRatioTool;
