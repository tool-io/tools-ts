import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verse: number;
  readonly suffix: string;
  readonly suppliedSuffixOrder: readonly string[];
};
export type Output = {
  readonly verse: number;
  readonly suffixIndex: number;
  readonly recognized: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verse: { type: "integer", minimum: 1 },
    suffix: { type: "string", maxLength: 8192 },
    suppliedSuffixOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["verse", "suffix", "suppliedSuffixOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verse: { type: "integer" },
    suffixIndex: { type: "integer" },
    recognized: { type: "boolean" },
  },
  required: ["verse", "suffixIndex", "recognized"],
} as const;
/** Order editorial verse suffixes only under a caller-supplied edition convention; no verse text or canonical numbering is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verse, suffix, suppliedSuffixOrder } = request;
  const compute = (): Output => {
    H.integer(verse, 1);
    H.domain(new Set(suppliedSuffixOrder).size === suppliedSuffixOrder.length);
    const suffixIndex = suppliedSuffixOrder.indexOf(suffix);
    return { verse, suffixIndex, recognized: suffixIndex >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { verse: 7, suffix: "b", suppliedSuffixOrder: ["", "a", "b"] },
  output: { verse: 7, suffixIndex: 2, recognized: true },
} satisfies ToolExample<Input, Output>;
export const quranVerseSuffixOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/quran-verse-suffix-order-token",
    title: "Quran Verse Suffix Order Token Tool",
    description:
      "Order editorial verse suffixes only under a caller-supplied edition convention; no verse text or canonical numbering is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verse: { type: "integer", minimum: 1 },
        suffix: { type: "string", maxLength: 8192 },
        suppliedSuffixOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["verse", "suffix", "suppliedSuffixOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verse: { type: "integer" },
        suffixIndex: { type: "integer" },
        recognized: { type: "boolean" },
      },
      required: ["verse", "suffixIndex", "recognized"],
    },
    ports: {
      inputs: [
        {
          id: "verse",
          label: "Verse",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSuffixOrder",
          label: "Supplied Suffix Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "verse", label: "Verse", valueType: { type: "integer" } },
        {
          id: "suffixIndex",
          label: "Suffix Index",
          valueType: { type: "integer" },
        },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quranVerseSuffixOrderTokenTool.execute;
export default quranVerseSuffixOrderTokenTool;
