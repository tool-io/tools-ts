import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedSyllablesPerToken: readonly number[] };
export type Output = { readonly syllables: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedSyllablesPerToken: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["suppliedSyllablesPerToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { syllables: { type: "integer" } },
  required: ["syllables"],
} as const;
/** Sum caller-annotated syllable counts without language-specific syllabification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedSyllablesPerToken } = request;
  const compute = (): Output => {
    H.domain(suppliedSyllablesPerToken.every((x) => x >= 0));
    return {
      syllables: Number(
        suppliedSyllablesPerToken.reduce((s, n) => s + BigInt(n), 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedSyllablesPerToken: [2, 1, 3] },
  output: { syllables: 6 },
} satisfies ToolExample<Input, Output>;
export const lyricLineSyllableCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/lyric-line-syllable-count",
    title: "Lyric Line Syllable Count Tool",
    description:
      "Sum caller-annotated syllable counts without language-specific syllabification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedSyllablesPerToken: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["suppliedSyllablesPerToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { syllables: { type: "integer" } },
      required: ["syllables"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedSyllablesPerToken",
          label: "Supplied Syllables Per Token",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "syllables", label: "Syllables", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lyricLineSyllableCountTool.execute;
export default lyricLineSyllableCountTool;
