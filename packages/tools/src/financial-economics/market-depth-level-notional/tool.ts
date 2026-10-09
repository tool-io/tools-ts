import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelPrice: number;
  readonly availableQuantity: number;
};
export type Output = { readonly signedLevelNotional: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelPrice: { type: "number" },
    availableQuantity: { type: "number", minimum: 0 },
  },
  required: ["levelPrice", "availableQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedLevelNotional: { type: "number" } },
  required: ["signedLevelNotional"],
} as const;
/** Value one supplied market-depth level using explicit price and available quantity without aggregating a book or predicting execution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelPrice, availableQuantity } = request;
  const compute = (): Output => {
    H.domain(availableQuantity >= 0, "availableQuantity");
    return { signedLevelNotional: levelPrice * availableQuantity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levelPrice: 25, availableQuantity: 40 },
  output: { signedLevelNotional: 1000 },
} satisfies ToolExample<Input, Output>;
export const marketDepthLevelNotionalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/market-depth-level-notional",
    title: "Market Depth Level Notional Tool",
    description:
      "Value one supplied market-depth level using explicit price and available quantity without aggregating a book or predicting execution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelPrice: { type: "number" },
        availableQuantity: { type: "number", minimum: 0 },
      },
      required: ["levelPrice", "availableQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedLevelNotional: { type: "number" } },
      required: ["signedLevelNotional"],
    },
    ports: {
      inputs: [
        {
          id: "levelPrice",
          label: "Level Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableQuantity",
          label: "Available Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedLevelNotional",
          label: "Signed Level Notional",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marketDepthLevelNotionalTool.execute;
export default marketDepthLevelNotionalTool;
