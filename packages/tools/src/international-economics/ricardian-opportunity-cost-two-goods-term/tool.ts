import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly laborPerFirst: number;
  readonly laborPerSecond: number;
  readonly availableLabor: number;
};
export type Output = {
  readonly firstCostInSecond: number;
  readonly secondCostInFirst: number;
  readonly maximumFirst: number;
  readonly maximumSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laborPerFirst: { type: "number", exclusiveMinimum: 0 },
    laborPerSecond: { type: "number", exclusiveMinimum: 0 },
    availableLabor: { type: "number", minimum: 0 },
  },
  required: ["laborPerFirst", "laborPerSecond", "availableLabor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCostInSecond: { type: "number" },
    secondCostInFirst: { type: "number" },
    maximumFirst: { type: "number" },
    maximumSecond: { type: "number" },
  },
  required: [
    "firstCostInSecond",
    "secondCostInFirst",
    "maximumFirst",
    "maximumSecond",
  ],
} as const;
/** Constant-unit-labor two-good production opportunity costs, excluding demand, trade equilibrium and adjustment costs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { laborPerFirst, laborPerSecond, availableLabor } = request;
  const compute = (): Output => {
    H.positive(laborPerFirst);
    H.positive(laborPerSecond);
    H.domain(availableLabor >= 0);
    return {
      firstCostInSecond: laborPerFirst / laborPerSecond,
      secondCostInFirst: laborPerSecond / laborPerFirst,
      maximumFirst: availableLabor / laborPerFirst,
      maximumSecond: availableLabor / laborPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { laborPerFirst: 2, laborPerSecond: 4, availableLabor: 100 },
  output: {
    firstCostInSecond: 0.5,
    secondCostInFirst: 2,
    maximumFirst: 50,
    maximumSecond: 25,
  },
} satisfies ToolExample<Input, Output>;
export const ricardianOpportunityCostTwoGoodsTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/ricardian-opportunity-cost-two-goods-term",
      title: "Ricardian Opportunity Cost Two Goods Term Tool",
      description:
        "Constant-unit-labor two-good production opportunity costs, excluding demand, trade equilibrium and adjustment costs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          laborPerFirst: { type: "number", exclusiveMinimum: 0 },
          laborPerSecond: { type: "number", exclusiveMinimum: 0 },
          availableLabor: { type: "number", minimum: 0 },
        },
        required: ["laborPerFirst", "laborPerSecond", "availableLabor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCostInSecond: { type: "number" },
          secondCostInFirst: { type: "number" },
          maximumFirst: { type: "number" },
          maximumSecond: { type: "number" },
        },
        required: [
          "firstCostInSecond",
          "secondCostInFirst",
          "maximumFirst",
          "maximumSecond",
        ],
      },
      ports: {
        inputs: [
          {
            id: "laborPerFirst",
            label: "Labor Per First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "laborPerSecond",
            label: "Labor Per Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableLabor",
            label: "Available Labor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstCostInSecond",
            label: "First Cost In Second",
            valueType: { type: "number" },
          },
          {
            id: "secondCostInFirst",
            label: "Second Cost In First",
            valueType: { type: "number" },
          },
          {
            id: "maximumFirst",
            label: "Maximum First",
            valueType: { type: "number" },
          },
          {
            id: "maximumSecond",
            label: "Maximum Second",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ricardianOpportunityCostTwoGoodsTermTool.execute;
export default ricardianOpportunityCostTwoGoodsTermTool;
