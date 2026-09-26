import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousIndex: number;
  readonly linkPrice: number;
  readonly priorPrice: number;
};
export type Output = { readonly linkedIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousIndex: { type: "number", minimum: 0 },
    linkPrice: { type: "number", minimum: 0 },
    priorPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["previousIndex", "linkPrice", "priorPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linkedIndex: { type: "number" } },
  required: ["linkedIndex"],
} as const;
/** Calculate price series chain link term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousIndex, linkPrice, priorPrice } = request;
  const compute = (): Output => {
    H.positive(priorPrice);
    H.domain(previousIndex >= 0 && linkPrice >= 0);
    return { linkedIndex: previousIndex * (linkPrice / priorPrice) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousIndex: 100, linkPrice: 12, priorPrice: 10 },
  output: { linkedIndex: 120 },
} satisfies ToolExample<Input, Output>;
export const priceSeriesChainLinkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/price-series-chain-link-term",
    title: "Price Series Chain Link Term Tool",
    description:
      "Calculate price series chain link term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousIndex: { type: "number", minimum: 0 },
        linkPrice: { type: "number", minimum: 0 },
        priorPrice: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["previousIndex", "linkPrice", "priorPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linkedIndex: { type: "number" } },
      required: ["linkedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "previousIndex",
          label: "Previous Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "linkPrice",
          label: "Link Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorPrice",
          label: "Prior Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linkedIndex",
          label: "Linked Index",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = priceSeriesChainLinkTermTool.execute;
export default priceSeriesChainLinkTermTool;
