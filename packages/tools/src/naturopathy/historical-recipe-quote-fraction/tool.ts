import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedParts: number;
  readonly quotedTotalParts: number;
  readonly sourceKnown: boolean;
};
export type Output = {
  readonly fractionDefined: boolean;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedParts: { type: "number", minimum: 0 },
    quotedTotalParts: { type: "number", exclusiveMinimum: 0 },
    sourceKnown: { type: "boolean" },
  },
  required: ["quotedParts", "quotedTotalParts", "sourceKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionDefined: { type: "boolean" },
    fraction: { type: "number" },
  },
  required: ["fractionDefined", "fraction"],
} as const;
/** Record a fraction quoted by a caller-supplied historical source; not a formulation or use recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedParts, quotedTotalParts, sourceKnown } = request;
  const compute = (): Output => {
    H.positive(quotedTotalParts);
    H.domain(quotedParts >= 0 && quotedParts <= quotedTotalParts);
    return {
      fractionDefined: sourceKnown,
      fraction: sourceKnown ? quotedParts / quotedTotalParts : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedParts: 2, quotedTotalParts: 8, sourceKnown: true },
  output: { fractionDefined: true, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const historicalRecipeQuoteFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/historical-recipe-quote-fraction",
    title: "Historical Recipe Quote Fraction Tool",
    description:
      "Record a fraction quoted by a caller-supplied historical source; not a formulation or use recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedParts: { type: "number", minimum: 0 },
        quotedTotalParts: { type: "number", exclusiveMinimum: 0 },
        sourceKnown: { type: "boolean" },
      },
      required: ["quotedParts", "quotedTotalParts", "sourceKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionDefined: { type: "boolean" },
        fraction: { type: "number" },
      },
      required: ["fractionDefined", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "quotedParts",
          label: "Quoted Parts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quotedTotalParts",
          label: "Quoted Total Parts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "fractionDefined",
          label: "Fraction Defined",
          valueType: { type: "boolean" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = historicalRecipeQuoteFractionTool.execute;
export default historicalRecipeQuoteFractionTool;
