import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cumPrice: number; readonly dividend: number };
export type Output = { readonly theoreticalExPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cumPrice: { type: "number", minimum: 0 },
    dividend: { type: "number", minimum: 0 },
  },
  required: ["cumPrice", "dividend"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { theoreticalExPrice: { type: "number" } },
  required: ["theoreticalExPrice"],
} as const;
/** Apply the ideal cash-dividend price bridge before taxes, market moves, or financing effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cumPrice, dividend } = request;
  const compute = (): Output => {
    H.domain(cumPrice >= 0 && dividend >= 0);
    return { theoreticalExPrice: cumPrice - dividend };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cumPrice: 50, dividend: 2 },
  output: { theoreticalExPrice: 48 },
} satisfies ToolExample<Input, Output>;
export const exDividendPriceCashBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/ex-dividend-price-cash-bridge",
    title: "Ex Dividend Price Cash Bridge Tool",
    description:
      "Apply the ideal cash-dividend price bridge before taxes, market moves, or financing effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cumPrice: { type: "number", minimum: 0 },
        dividend: { type: "number", minimum: 0 },
      },
      required: ["cumPrice", "dividend"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { theoreticalExPrice: { type: "number" } },
      required: ["theoreticalExPrice"],
    },
    ports: {
      inputs: [
        {
          id: "cumPrice",
          label: "Cum Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dividend",
          label: "Dividend",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "theoreticalExPrice",
          label: "Theoretical Ex Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exDividendPriceCashBridgeTool.execute;
export default exDividendPriceCashBridgeTool;
