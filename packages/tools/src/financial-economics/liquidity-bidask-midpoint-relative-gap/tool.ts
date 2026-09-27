import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bid: number; readonly ask: number };
export type Output = {
  readonly midpoint: number;
  readonly spread: number;
  readonly relativeSpread: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bid: { type: "number", minimum: 0 }, ask: { type: "number" } },
  required: ["bid", "ask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpoint: { type: "number" },
    spread: { type: "number" },
    relativeSpread: { type: "number" },
  },
  required: ["midpoint", "spread", "relativeSpread"],
} as const;
/** Calculate liquidity bidask midpoint relative gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bid, ask } = request;
  const compute = (): Output => {
    H.domain(bid >= 0 && ask >= bid && ask + bid > 0);
    return {
      midpoint: (bid + ask) / 2,
      spread: ask - bid,
      relativeSpread: (2 * (ask - bid)) / (ask + bid),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bid: 99, ask: 101 },
  output: { midpoint: 100, spread: 2, relativeSpread: 0.02 },
} satisfies ToolExample<Input, Output>;
export const liquidityBidaskMidpointRelativeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/liquidity-bidask-midpoint-relative-gap",
    title: "Liquidity Bidask Midpoint Relative Gap Tool",
    description:
      "Calculate liquidity bidask midpoint relative gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bid: { type: "number", minimum: 0 },
        ask: { type: "number" },
      },
      required: ["bid", "ask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        spread: { type: "number" },
        relativeSpread: { type: "number" },
      },
      required: ["midpoint", "spread", "relativeSpread"],
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
        {
          id: "relativeSpread",
          label: "Relative Spread",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = liquidityBidaskMidpointRelativeGapTool.execute;
export default liquidityBidaskMidpointRelativeGapTool;
