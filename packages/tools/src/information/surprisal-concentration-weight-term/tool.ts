import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly weight: number;
  readonly logBase: number;
};
export type Output = {
  readonly surprisal: number;
  readonly weightedTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    weight: { type: "number", minimum: 0 },
    logBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["probability", "weight", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surprisal: { type: "number" },
    weightedTerm: { type: "number" },
  },
  required: ["surprisal", "weightedTerm"],
} as const;
/** One explicitly weighted surprisal term, without assuming the weight equals the event probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, weight, logBase } = request;
  const compute = (): Output => {
    H.domain(probability > 0 && probability <= 1 && weight >= 0 && logBase > 1);
    return {
      surprisal: -Math.log(probability) / Math.log(logBase),
      weightedTerm: (-weight * Math.log(probability)) / Math.log(logBase),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.25, weight: 0.5, logBase: 2 },
  output: { surprisal: 2, weightedTerm: 1 },
} satisfies ToolExample<Input, Output>;
export const surprisalConcentrationWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/surprisal-concentration-weight-term",
    title: "Surprisal Concentration Weight Term Tool",
    description:
      "One explicitly weighted surprisal term, without assuming the weight equals the event probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        weight: { type: "number", minimum: 0 },
        logBase: { type: "number", exclusiveMinimum: 1 },
      },
      required: ["probability", "weight", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surprisal: { type: "number" },
        weightedTerm: { type: "number" },
      },
      required: ["surprisal", "weightedTerm"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "weight",
          label: "Weight",
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
        { id: "surprisal", label: "Surprisal", valueType: { type: "number" } },
        {
          id: "weightedTerm",
          label: "Weighted Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surprisalConcentrationWeightTermTool.execute;
export default surprisalConcentrationWeightTermTool;
