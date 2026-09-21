import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly weight: number;
  readonly totalWeight: number;
};
export type Output = {
  readonly normalizedWeight: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    weight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["score", "weight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedWeight: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["normalizedWeight", "contribution"],
} as const;
/** Calculate learning contract one goal weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, weight, totalWeight } = request;
  const compute = (): Output => {
    H.positive(totalWeight);
    H.domain(weight >= 0 && weight <= totalWeight);
    return {
      normalizedWeight: weight / totalWeight,
      contribution: (score * weight) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 80, weight: 2, totalWeight: 5 },
  output: { normalizedWeight: 0.4, contribution: 32 },
} satisfies ToolExample<Input, Output>;
export const learningContractOneGoalWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learning-contract-one-goal-weight",
    title: "Learning Contract One Goal Weight Tool",
    description:
      "Calculate learning contract one goal weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        weight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["score", "weight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedWeight: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["normalizedWeight", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedWeight",
          label: "Normalized Weight",
          valueType: { type: "number" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learningContractOneGoalWeightTool.execute;
export default learningContractOneGoalWeightTool;
