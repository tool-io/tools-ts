import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quoteUnits: number;
  readonly beforeUnits: number;
  readonly afterUnits: number;
  readonly maximumUnits: number;
};
export type Output = {
  readonly expandedUnits: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quoteUnits: { type: "integer", minimum: 0 },
    beforeUnits: { type: "integer", minimum: 0 },
    afterUnits: { type: "integer", minimum: 0 },
    maximumUnits: { type: "integer", minimum: 0 },
  },
  required: ["quoteUnits", "beforeUnits", "afterUnits", "maximumUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedUnits: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["expandedUnits", "remaining", "fits"],
} as const;
/** Calculate quotation context expansion budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quoteUnits, beforeUnits, afterUnits, maximumUnits } = request;
  const compute = (): Output => {
    H.integer(quoteUnits, 0);
    H.integer(beforeUnits, 0);
    H.integer(afterUnits, 0);
    H.integer(maximumUnits, 0);
    return {
      expandedUnits: quoteUnits + beforeUnits + afterUnits,
      remaining: maximumUnits - quoteUnits - beforeUnits - afterUnits,
      fits: quoteUnits + beforeUnits + afterUnits <= maximumUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quoteUnits: 100,
    beforeUnits: 20,
    afterUnits: 30,
    maximumUnits: 180,
  },
  output: { expandedUnits: 150, remaining: 30, fits: true },
} satisfies ToolExample<Input, Output>;
export const quotationContextExpansionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/quotation-context-expansion-budget",
    title: "Quotation Context Expansion Budget Tool",
    description:
      "Calculate quotation context expansion budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quoteUnits: { type: "integer", minimum: 0 },
        beforeUnits: { type: "integer", minimum: 0 },
        afterUnits: { type: "integer", minimum: 0 },
        maximumUnits: { type: "integer", minimum: 0 },
      },
      required: ["quoteUnits", "beforeUnits", "afterUnits", "maximumUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedUnits: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["expandedUnits", "remaining", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "quoteUnits",
          label: "Quote Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beforeUnits",
          label: "Before Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "afterUnits",
          label: "After Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maximumUnits",
          label: "Maximum Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expandedUnits",
          label: "Expanded Units",
          valueType: { type: "integer" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = quotationContextExpansionBudgetTool.execute;
export default quotationContextExpansionBudgetTool;
