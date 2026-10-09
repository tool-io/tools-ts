import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marketQuantityAtPrice: number;
  readonly rivalQuantity: number;
};
export type Output = {
  readonly rawResidualQuantity: number;
  readonly nonnegativeResidualQuantity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketQuantityAtPrice: { type: "number", minimum: 0 },
    rivalQuantity: { type: "number", minimum: 0 },
  },
  required: ["marketQuantityAtPrice", "rivalQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawResidualQuantity: { type: "number" },
    nonnegativeResidualQuantity: { type: "number" },
  },
  required: ["rawResidualQuantity", "nonnegativeResidualQuantity"],
} as const;
/** Subtract supplied rival quantity from market quantity at one explicit price without estimating a demand curve or equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marketQuantityAtPrice, rivalQuantity } = request;
  const compute = (): Output => {
    H.domain(marketQuantityAtPrice >= 0, "marketQuantityAtPrice");
    H.domain(rivalQuantity >= 0, "rivalQuantity");
    return {
      rawResidualQuantity: marketQuantityAtPrice - rivalQuantity,
      nonnegativeResidualQuantity: Math.max(
        0,
        marketQuantityAtPrice - rivalQuantity,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marketQuantityAtPrice: 100, rivalQuantity: 30 },
  output: { rawResidualQuantity: 70, nonnegativeResidualQuantity: 70 },
} satisfies ToolExample<Input, Output>;
export const duopolyFirmResidualDemandTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/duopoly-firm-residual-demand-term",
    title: "Duopoly Firm Residual Demand Term Tool",
    description:
      "Subtract supplied rival quantity from market quantity at one explicit price without estimating a demand curve or equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketQuantityAtPrice: { type: "number", minimum: 0 },
        rivalQuantity: { type: "number", minimum: 0 },
      },
      required: ["marketQuantityAtPrice", "rivalQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawResidualQuantity: { type: "number" },
        nonnegativeResidualQuantity: { type: "number" },
      },
      required: ["rawResidualQuantity", "nonnegativeResidualQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "marketQuantityAtPrice",
          label: "Market Quantity At Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rivalQuantity",
          label: "Rival Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawResidualQuantity",
          label: "Raw Residual Quantity",
          valueType: { type: "number" },
        },
        {
          id: "nonnegativeResidualQuantity",
          label: "Nonnegative Residual Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = duopolyFirmResidualDemandTermTool.execute;
export default duopolyFirmResidualDemandTermTool;
