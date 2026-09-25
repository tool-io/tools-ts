import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefixCharacters: number;
  readonly quoteCharacters: number;
  readonly suffixCharacters: number;
  readonly limit: number;
};
export type Output = {
  readonly used: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixCharacters: { type: "integer", minimum: 0 },
    quoteCharacters: { type: "integer", minimum: 0 },
    suffixCharacters: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 0 },
  },
  required: [
    "prefixCharacters",
    "quoteCharacters",
    "suffixCharacters",
    "limit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["used", "remaining", "fits"],
} as const;
/** Calculate annotation quote prefix suffix budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixCharacters, quoteCharacters, suffixCharacters, limit } =
    request;
  const compute = (): Output => {
    H.integer(prefixCharacters, 0);
    H.integer(quoteCharacters, 0);
    H.integer(suffixCharacters, 0);
    H.integer(limit, 0);
    return {
      used: prefixCharacters + quoteCharacters + suffixCharacters,
      remaining: limit - prefixCharacters - quoteCharacters - suffixCharacters,
      fits: prefixCharacters + quoteCharacters + suffixCharacters <= limit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prefixCharacters: 10,
    quoteCharacters: 40,
    suffixCharacters: 15,
    limit: 100,
  },
  output: { used: 65, remaining: 35, fits: true },
} satisfies ToolExample<Input, Output>;
export const annotationQuotePrefixSuffixBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/annotation-quote-prefix-suffix-budget",
    title: "Annotation Quote Prefix Suffix Budget Tool",
    description:
      "Calculate annotation quote prefix suffix budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixCharacters: { type: "integer", minimum: 0 },
        quoteCharacters: { type: "integer", minimum: 0 },
        suffixCharacters: { type: "integer", minimum: 0 },
        limit: { type: "integer", minimum: 0 },
      },
      required: [
        "prefixCharacters",
        "quoteCharacters",
        "suffixCharacters",
        "limit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        used: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["used", "remaining", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "prefixCharacters",
          label: "Prefix Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quoteCharacters",
          label: "Quote Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suffixCharacters",
          label: "Suffix Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = annotationQuotePrefixSuffixBudgetTool.execute;
export default annotationQuotePrefixSuffixBudgetTool;
