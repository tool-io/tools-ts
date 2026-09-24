import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceYear: number;
  readonly comparisonYear: number;
};
export type Output = { readonly lagYears: number; readonly order: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceYear: { type: "integer" },
    comparisonYear: { type: "integer" },
  },
  required: ["sourceYear", "comparisonYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagYears: { type: "integer" },
    order: { type: "string", maxLength: 8192 },
  },
  required: ["lagYears", "order"],
} as const;
/** Subtract explicit astronomical year numbers, which include year zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceYear, comparisonYear } = request;
  const compute = (): Output => {
    return {
      lagYears: comparisonYear - sourceYear,
      order:
        comparisonYear === sourceYear
          ? "same-year"
          : comparisonYear > sourceYear
            ? "later"
            : "earlier",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceYear: 1860, comparisonYear: 1875 },
  output: { lagYears: 15, order: "later" },
} satisfies ToolExample<Input, Output>;
export const comparativeWorkPublicationLagTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/comparative-work-publication-lag-term",
    title: "Comparative Work Publication Lag Term Tool",
    description:
      "Subtract explicit astronomical year numbers, which include year zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceYear: { type: "integer" },
        comparisonYear: { type: "integer" },
      },
      required: ["sourceYear", "comparisonYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagYears: { type: "integer" },
        order: { type: "string", maxLength: 8192 },
      },
      required: ["lagYears", "order"],
    },
    ports: {
      inputs: [
        {
          id: "sourceYear",
          label: "Source Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "comparisonYear",
          label: "Comparison Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lagYears", label: "Lag Years", valueType: { type: "integer" } },
        { id: "order", label: "Order", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = comparativeWorkPublicationLagTermTool.execute;
export default comparativeWorkPublicationLagTermTool;
