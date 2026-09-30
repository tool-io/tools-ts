import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thresholdQuantity: number;
  readonly unitPriceBelow: number;
  readonly unitPriceAtOrAbove: number;
};
export type Output = {
  readonly costBefore: number;
  readonly costAtThreshold: number;
  readonly jump: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thresholdQuantity: { type: "integer", minimum: 1 },
    unitPriceBelow: { type: "number", minimum: 0 },
    unitPriceAtOrAbove: { type: "number", minimum: 0 },
  },
  required: ["thresholdQuantity", "unitPriceBelow", "unitPriceAtOrAbove"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costBefore: { type: "number" },
    costAtThreshold: { type: "number" },
    jump: { type: "number" },
  },
  required: ["costBefore", "costAtThreshold", "jump"],
} as const;
/** Compare total costs immediately across an explicit all-units discount threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thresholdQuantity, unitPriceBelow, unitPriceAtOrAbove } = request;
  const compute = (): Output => {
    H.integer(thresholdQuantity, 1);
    H.domain(unitPriceBelow >= 0 && unitPriceAtOrAbove >= 0);
    return {
      costBefore: (thresholdQuantity - 1) * unitPriceBelow,
      costAtThreshold: thresholdQuantity * unitPriceAtOrAbove,
      jump:
        thresholdQuantity * unitPriceAtOrAbove -
        (thresholdQuantity - 1) * unitPriceBelow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thresholdQuantity: 10, unitPriceBelow: 5, unitPriceAtOrAbove: 4 },
  output: { costBefore: 45, costAtThreshold: 40, jump: -5 },
} satisfies ToolExample<Input, Output>;
export const promotionThresholdPriceJumpTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/promotion-threshold-price-jump",
    title: "Promotion Threshold Price Jump Tool",
    description:
      "Compare total costs immediately across an explicit all-units discount threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thresholdQuantity: { type: "integer", minimum: 1 },
        unitPriceBelow: { type: "number", minimum: 0 },
        unitPriceAtOrAbove: { type: "number", minimum: 0 },
      },
      required: ["thresholdQuantity", "unitPriceBelow", "unitPriceAtOrAbove"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costBefore: { type: "number" },
        costAtThreshold: { type: "number" },
        jump: { type: "number" },
      },
      required: ["costBefore", "costAtThreshold", "jump"],
    },
    ports: {
      inputs: [
        {
          id: "thresholdQuantity",
          label: "Threshold Quantity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitPriceBelow",
          label: "Unit Price Below",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitPriceAtOrAbove",
          label: "Unit Price At Or Above",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costBefore",
          label: "Cost Before",
          valueType: { type: "number" },
        },
        {
          id: "costAtThreshold",
          label: "Cost At Threshold",
          valueType: { type: "number" },
        },
        { id: "jump", label: "Jump", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = promotionThresholdPriceJumpTool.execute;
export default promotionThresholdPriceJumpTool;
