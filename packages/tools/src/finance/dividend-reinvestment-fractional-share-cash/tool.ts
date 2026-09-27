import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cash: number;
  readonly price: number;
  readonly allowFractional: boolean;
};
export type Output = { readonly shares: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cash: { type: "number", minimum: 0 },
    price: { type: "number", exclusiveMinimum: 0 },
    allowFractional: { type: "boolean" },
  },
  required: ["cash", "price", "allowFractional"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shares: { type: "number" }, remainder: { type: "number" } },
  required: ["shares", "remainder"],
} as const;
/** Allocate dividend cash to whole or fractional shares using an explicit execution price, excluding fees. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { cash, price, allowFractional } = input;
  const compute = (): Output => {
    H.domain(cash >= 0);
    H.positive(price);
    const shares = allowFractional ? cash / price : Math.floor(cash / price);
    return { shares, remainder: allowFractional ? 0 : cash - shares * price };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cash: 105, price: 20, allowFractional: false },
  output: { shares: 5, remainder: 5 },
} satisfies ToolExample<Input, Output>;
export const dividendReinvestmentFractionalShareCashTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/dividend-reinvestment-fractional-share-cash",
      title: "Dividend Reinvestment Fractional Share Cash Tool",
      description:
        "Allocate dividend cash to whole or fractional shares using an explicit execution price, excluding fees.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cash: { type: "number", minimum: 0 },
          price: { type: "number", exclusiveMinimum: 0 },
          allowFractional: { type: "boolean" },
        },
        required: ["cash", "price", "allowFractional"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shares: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["shares", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "cash",
            label: "Cash",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "price",
            label: "Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowFractional",
            label: "Allow Fractional",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "shares", label: "Shares", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dividendReinvestmentFractionalShareCashTool.execute;
export default dividendReinvestmentFractionalShareCashTool;
