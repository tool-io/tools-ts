import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedVariance: number;
  readonly reliability: number;
};
export type Output = {
  readonly trueVariance: number;
  readonly errorVariance: number;
  readonly standardError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedVariance: { type: "number", minimum: 0 },
    reliability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["observedVariance", "reliability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trueVariance: { type: "number" },
    errorVariance: { type: "number" },
    standardError: { type: "number" },
  },
  required: ["trueVariance", "errorVariance", "standardError"],
} as const;
/** Calculate reliability item error variance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedVariance, reliability } = request;
  const compute = (): Output => {
    H.domain(observedVariance >= 0);
    H.probability(reliability);
    return {
      trueVariance: observedVariance * reliability,
      errorVariance: observedVariance * (1 - reliability),
      standardError: Math.sqrt(observedVariance * (1 - reliability)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedVariance: 100, reliability: 0.75 },
  output: { trueVariance: 75, errorVariance: 25, standardError: 5 },
} satisfies ToolExample<Input, Output>;
export const reliabilityItemErrorVarianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/reliability-item-error-variance-term",
    title: "Reliability Item Error Variance Term Tool",
    description:
      "Calculate reliability item error variance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedVariance: { type: "number", minimum: 0 },
        reliability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["observedVariance", "reliability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trueVariance: { type: "number" },
        errorVariance: { type: "number" },
        standardError: { type: "number" },
      },
      required: ["trueVariance", "errorVariance", "standardError"],
    },
    ports: {
      inputs: [
        {
          id: "observedVariance",
          label: "Observed Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reliability",
          label: "Reliability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "trueVariance",
          label: "True Variance",
          valueType: { type: "number" },
        },
        {
          id: "errorVariance",
          label: "Error Variance",
          valueType: { type: "number" },
        },
        {
          id: "standardError",
          label: "Standard Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliabilityItemErrorVarianceTermTool.execute;
export default reliabilityItemErrorVarianceTermTool;
