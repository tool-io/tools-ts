import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startTokenIndex: number;
  readonly endTokenIndexExclusive: number;
};
export type Output = { readonly omittedTokenCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startTokenIndex: { type: "integer", minimum: 0 },
    endTokenIndexExclusive: { type: "integer" },
  },
  required: ["startTokenIndex", "endTokenIndexExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { omittedTokenCount: { type: "integer" } },
  required: ["omittedTokenCount"],
} as const;
/** Count tokens in an explicitly annotated half-open translation-omission span; no omission is inferred from text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startTokenIndex, endTokenIndexExclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startTokenIndex) &&
        startTokenIndex >= 0 &&
        startTokenIndex <= Number.MAX_SAFE_INTEGER,
      "startTokenIndex",
    ),
      startTokenIndex);
    (H.domain(
      Number.isSafeInteger(endTokenIndexExclusive) &&
        endTokenIndexExclusive >= startTokenIndex &&
        endTokenIndexExclusive <= Number.MAX_SAFE_INTEGER,
      "endTokenIndexExclusive",
    ),
      endTokenIndexExclusive);
    return { omittedTokenCount: endTokenIndexExclusive - startTokenIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startTokenIndex: 12, endTokenIndexExclusive: 20 },
  output: { omittedTokenCount: 8 },
} satisfies ToolExample<Input, Output>;
export const translationOmissionSpanLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/translation-omission-span-length",
    title: "Translation Omission Span Length",
    description:
      "Count tokens in an explicitly annotated half-open translation-omission span; no omission is inferred from text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startTokenIndex: { type: "integer", minimum: 0 },
        endTokenIndexExclusive: { type: "integer" },
      },
      required: ["startTokenIndex", "endTokenIndexExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { omittedTokenCount: { type: "integer" } },
      required: ["omittedTokenCount"],
    },
    ports: {
      inputs: [
        {
          id: "startTokenIndex",
          label: "Start Token Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endTokenIndexExclusive",
          label: "End Token Index Exclusive",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "omittedTokenCount",
          label: "Omitted Token Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = translationOmissionSpanLengthTool.execute;
export default translationOmissionSpanLengthTool;
