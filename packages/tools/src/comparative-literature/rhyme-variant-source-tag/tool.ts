import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variant: string;
  readonly source: string;
  readonly edition: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variant: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["variant", "source", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Preserve a supplied rhyme-variant spelling and source without guessing phonological equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variant, source, edition } = request;
  const compute = (): Output => {
    H.domain(variant.length > 0 && source.length > 0 && edition.length > 0);
    return { key: JSON.stringify([source, edition, variant]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { variant: "night", source: "edition-A", edition: "1900" },
  output: { key: '["edition-A","1900","night"]' },
} satisfies ToolExample<Input, Output>;
export const rhymeVariantSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/rhyme-variant-source-tag",
    title: "Rhyme Variant Source Tag Tool",
    description:
      "Preserve a supplied rhyme-variant spelling and source without guessing phonological equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variant: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: ["variant", "source", "edition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "variant",
          label: "Variant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rhymeVariantSourceTagTool.execute;
export default rhymeVariantSourceTagTool;
