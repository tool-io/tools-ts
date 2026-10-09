import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStagDeviationLoss: number;
  readonly secondStagDeviationLoss: number;
  readonly firstHareDeviationLoss: number;
  readonly secondHareDeviationLoss: number;
};
export type Output = {
  readonly stagLossProduct: number;
  readonly hareLossProduct: number;
  readonly stagRiskDominates: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStagDeviationLoss: { type: "number", minimum: 0 },
    secondStagDeviationLoss: { type: "number", minimum: 0 },
    firstHareDeviationLoss: { type: "number", minimum: 0 },
    secondHareDeviationLoss: { type: "number", minimum: 0 },
  },
  required: [
    "firstStagDeviationLoss",
    "secondStagDeviationLoss",
    "firstHareDeviationLoss",
    "secondHareDeviationLoss",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stagLossProduct: { type: "number" },
    hareLossProduct: { type: "number" },
    stagRiskDominates: { type: "boolean" },
  },
  required: ["stagLossProduct", "hareLossProduct", "stagRiskDominates"],
} as const;
/** Compare supplied unilateral-deviation loss products for two coordination equilibria using the strict risk-dominance criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstStagDeviationLoss,
    secondStagDeviationLoss,
    firstHareDeviationLoss,
    secondHareDeviationLoss,
  } = request;
  const compute = (): Output => {
    H.domain(firstStagDeviationLoss >= 0, "firstStagDeviationLoss");
    H.domain(secondStagDeviationLoss >= 0, "secondStagDeviationLoss");
    H.domain(firstHareDeviationLoss >= 0, "firstHareDeviationLoss");
    H.domain(secondHareDeviationLoss >= 0, "secondHareDeviationLoss");
    return {
      stagLossProduct: firstStagDeviationLoss * secondStagDeviationLoss,
      hareLossProduct: firstHareDeviationLoss * secondHareDeviationLoss,
      stagRiskDominates:
        firstStagDeviationLoss * secondStagDeviationLoss >
        firstHareDeviationLoss * secondHareDeviationLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStagDeviationLoss: 4,
    secondStagDeviationLoss: 3,
    firstHareDeviationLoss: 2,
    secondHareDeviationLoss: 2,
  },
  output: { stagLossProduct: 12, hareLossProduct: 4, stagRiskDominates: true },
} satisfies ToolExample<Input, Output>;
export const stagHuntRiskDominancePayoffProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/stag-hunt-risk-dominance-payoff-product",
    title: "Stag Hunt Risk Dominance Payoff Product Tool",
    description:
      "Compare supplied unilateral-deviation loss products for two coordination equilibria using the strict risk-dominance criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStagDeviationLoss: { type: "number", minimum: 0 },
        secondStagDeviationLoss: { type: "number", minimum: 0 },
        firstHareDeviationLoss: { type: "number", minimum: 0 },
        secondHareDeviationLoss: { type: "number", minimum: 0 },
      },
      required: [
        "firstStagDeviationLoss",
        "secondStagDeviationLoss",
        "firstHareDeviationLoss",
        "secondHareDeviationLoss",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stagLossProduct: { type: "number" },
        hareLossProduct: { type: "number" },
        stagRiskDominates: { type: "boolean" },
      },
      required: ["stagLossProduct", "hareLossProduct", "stagRiskDominates"],
    },
    ports: {
      inputs: [
        {
          id: "firstStagDeviationLoss",
          label: "First Stag Deviation Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStagDeviationLoss",
          label: "Second Stag Deviation Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHareDeviationLoss",
          label: "First Hare Deviation Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHareDeviationLoss",
          label: "Second Hare Deviation Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stagLossProduct",
          label: "Stag Loss Product",
          valueType: { type: "number" },
        },
        {
          id: "hareLossProduct",
          label: "Hare Loss Product",
          valueType: { type: "number" },
        },
        {
          id: "stagRiskDominates",
          label: "Stag Risk Dominates",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stagHuntRiskDominancePayoffProductTool.execute;
export default stagHuntRiskDominancePayoffProductTool;
