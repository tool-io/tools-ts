import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceYear: number;
  readonly priceYear: number;
};
export type Output = { readonly yearGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceYear: { type: "integer" },
    priceYear: { type: "integer" },
  },
  required: ["resourceYear", "priceYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { yearGap: { type: "integer" } },
  required: ["yearGap"],
} as const;
/** Compare explicit price and resource-use years without inflation adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceYear, priceYear } = request;
  const compute = (): Output => {
    return { yearGap: Number(BigInt(priceYear) - BigInt(resourceYear)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resourceYear: 2020, priceYear: 2024 },
  output: { yearGap: 4 },
} satisfies ToolExample<Input, Output>;
export const resourceUsePriceYearGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/resource-use-price-year-gap",
    title: "Resource Use Price Year Gap Tool",
    description:
      "Compare explicit price and resource-use years without inflation adjustment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceYear: { type: "integer" },
        priceYear: { type: "integer" },
      },
      required: ["resourceYear", "priceYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { yearGap: { type: "integer" } },
      required: ["yearGap"],
    },
    ports: {
      inputs: [
        {
          id: "resourceYear",
          label: "Resource Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "priceYear",
          label: "Price Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "yearGap", label: "Year Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = resourceUsePriceYearGapTool.execute;
export default resourceUsePriceYearGapTool;
