import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bid: number; readonly ask: number };
export type Output = { readonly midpoint: number; readonly spread: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bid: { type: "number" }, ask: { type: "number" } },
  required: ["bid", "ask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, spread: { type: "number" } },
  required: ["midpoint", "spread"],
} as const;
/** Return midpoint and quoted spread from an explicitly ordered bid and ask, permitting negative prices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bid, ask } = request;
  const compute = (): Output => {
    H.domain(ask >= bid, "ask");
    return { midpoint: bid / 2 + ask / 2, spread: ask - bid };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bid: 99, ask: 101 },
  output: { midpoint: 100, spread: 2 },
} satisfies ToolExample<Input, Output>;
export const marketQuoteBidaskMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/market-quote-bid-ask-midpoint",
    title: "Market Quote Bid Ask Midpoint",
    description:
      "Return midpoint and quoted spread from an explicitly ordered bid and ask, permitting negative prices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bid: { type: "number" }, ask: { type: "number" } },
      required: ["bid", "ask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { midpoint: { type: "number" }, spread: { type: "number" } },
      required: ["midpoint", "spread"],
    },
    ports: {
      inputs: [
        {
          id: "bid",
          label: "Bid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ask",
          label: "Ask",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "spread", label: "Spread", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marketQuoteBidaskMidpointTool.execute;
export default marketQuoteBidaskMidpointTool;
