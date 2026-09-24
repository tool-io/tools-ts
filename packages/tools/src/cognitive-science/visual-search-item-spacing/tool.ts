import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly span: number;
  readonly itemCount: number;
  readonly includeBothEndpoints: boolean;
};
export type Output = { readonly spacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    span: { type: "number", minimum: 0 },
    itemCount: { type: "integer" },
    includeBothEndpoints: { type: "boolean" },
  },
  required: ["span", "itemCount", "includeBothEndpoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spacing: { type: "number" } },
  required: ["spacing"],
} as const;
/** Compute uniform supplied visual-search spacing under an explicit endpoint convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { span, itemCount, includeBothEndpoints } = request;
  const compute = (): Output => {
    H.domain(span >= 0);
    H.integer(itemCount, includeBothEndpoints ? 2 : 1);
    return {
      spacing: span / (includeBothEndpoints ? itemCount - 1 : itemCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { span: 20, itemCount: 5, includeBothEndpoints: true },
  output: { spacing: 5 },
} satisfies ToolExample<Input, Output>;
export const visualSearchItemSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/visual-search-item-spacing",
    title: "Visual Search Item Spacing Tool",
    description:
      "Compute uniform supplied visual-search spacing under an explicit endpoint convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        span: { type: "number", minimum: 0 },
        itemCount: { type: "integer" },
        includeBothEndpoints: { type: "boolean" },
      },
      required: ["span", "itemCount", "includeBothEndpoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spacing: { type: "number" } },
      required: ["spacing"],
    },
    ports: {
      inputs: [
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "itemCount",
          label: "Item Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeBothEndpoints",
          label: "Include Both Endpoints",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = visualSearchItemSpacingTool.execute;
export default visualSearchItemSpacingTool;
