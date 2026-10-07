import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectiveProbability: number;
  readonly suppliedDecisionWeight: number;
};
export type Output = { readonly weightMinusProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectiveProbability: { type: "number", minimum: 0, maximum: 1 },
    suppliedDecisionWeight: { type: "number", minimum: 0 },
  },
  required: ["objectiveProbability", "suppliedDecisionWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightMinusProbability: { type: "number" } },
  required: ["weightMinusProbability"],
} as const;
/** Compare an explicit nonnegative decision weight with an objective probability without fitting a probability-weighting function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectiveProbability, suppliedDecisionWeight } = request;
  const compute = (): Output => {
    (H.domain(
      objectiveProbability >= 0 && objectiveProbability <= 1,
      "objectiveProbability",
    ),
      objectiveProbability);
    H.domain(suppliedDecisionWeight >= 0, "suppliedDecisionWeight");
    return {
      weightMinusProbability: suppliedDecisionWeight - objectiveProbability,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectiveProbability: 0.25, suppliedDecisionWeight: 0.4 },
  output: { weightMinusProbability: 0.15000000000000002 },
} satisfies ToolExample<Input, Output>;
export const probabilityWeightSuppliedModelPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["behavioral-economics", "behavioral economics", "economics"],
        keywords: ["behavioral economics", "economics"],
      },
      id: "behavioral-economics/probability-weight-supplied-model-point",
      title: "Probability Weight Supplied Model Point",
      description:
        "Compare an explicit nonnegative decision weight with an objective probability without fitting a probability-weighting function.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectiveProbability: { type: "number", minimum: 0, maximum: 1 },
          suppliedDecisionWeight: { type: "number", minimum: 0 },
        },
        required: ["objectiveProbability", "suppliedDecisionWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { weightMinusProbability: { type: "number" } },
        required: ["weightMinusProbability"],
      },
      ports: {
        inputs: [
          {
            id: "objectiveProbability",
            label: "Objective Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDecisionWeight",
            label: "Supplied Decision Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightMinusProbability",
            label: "Weight Minus Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = probabilityWeightSuppliedModelPointTool.execute;
export default probabilityWeightSuppliedModelPointTool;
