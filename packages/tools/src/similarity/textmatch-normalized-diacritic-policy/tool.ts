import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: string;
  readonly second: string;
  readonly ignoreDiacritics: boolean;
};
export type Output = {
  readonly match: boolean;
  readonly normalizedFirst: string;
  readonly normalizedSecond: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
    ignoreDiacritics: { type: "boolean" },
  },
  required: ["first", "second", "ignoreDiacritics"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    match: { type: "boolean" },
    normalizedFirst: { type: "string", maxLength: 8192 },
    normalizedSecond: { type: "string", maxLength: 8192 },
  },
  required: ["match", "normalizedFirst", "normalizedSecond"],
} as const;
/** Calculate textmatch normalized diacritic policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, ignoreDiacritics } = request;
  const compute = (): Output => {
    const normalize = (s: string) =>
        ignoreDiacritics
          ? s.normalize("NFD").replace(/\p{M}/gu, "")
          : s.normalize("NFC"),
      normalizedFirst = normalize(first),
      normalizedSecond = normalize(second);
    return {
      match: normalizedFirst === normalizedSecond,
      normalizedFirst,
      normalizedSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "café", second: "cafe", ignoreDiacritics: true },
  output: { match: true, normalizedFirst: "cafe", normalizedSecond: "cafe" },
} satisfies ToolExample<Input, Output>;
export const textmatchNormalizedDiacriticPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/textmatch-normalized-diacritic-policy",
    title: "Textmatch Normalized Diacritic Policy Tool",
    description:
      "Calculate textmatch normalized diacritic policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
        ignoreDiacritics: { type: "boolean" },
      },
      required: ["first", "second", "ignoreDiacritics"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        match: { type: "boolean" },
        normalizedFirst: { type: "string", maxLength: 8192 },
        normalizedSecond: { type: "string", maxLength: 8192 },
      },
      required: ["match", "normalizedFirst", "normalizedSecond"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ignoreDiacritics",
          label: "Ignore Diacritics",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "match", label: "Match", valueType: { type: "boolean" } },
        {
          id: "normalizedFirst",
          label: "Normalized First",
          valueType: { type: "string" },
        },
        {
          id: "normalizedSecond",
          label: "Normalized Second",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = textmatchNormalizedDiacriticPolicyTool.execute;
export default textmatchNormalizedDiacriticPolicyTool;
