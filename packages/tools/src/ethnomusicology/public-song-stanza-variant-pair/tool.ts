import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly songId: string;
  readonly firstVariant: string;
  readonly secondVariant: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    songId: { type: "string", maxLength: 8192, minLength: 1 },
    firstVariant: { type: "string", maxLength: 8192, minLength: 1 },
    secondVariant: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["songId", "firstVariant", "secondVariant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit public stanza-variant identifiers within one song record without claiming textual equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { songId, firstVariant, secondVariant } = request;
  const compute = (): Output => {
    H.domain(songId.length > 0, "songId");
    H.domain(firstVariant.length > 0, "firstVariant");
    H.domain(secondVariant.length > 0, "secondVariant");
    return { token: JSON.stringify([songId, firstVariant, secondVariant]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { songId: "S17", firstVariant: "A", secondVariant: "B" },
  output: { token: '["S17","A","B"]' },
} satisfies ToolExample<Input, Output>;
export const publicSongStanzaVariantPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/public-song-stanza-variant-pair",
    title: "Public Song Stanza Variant Pair",
    description:
      "Pair explicit public stanza-variant identifiers within one song record without claiming textual equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        songId: { type: "string", maxLength: 8192, minLength: 1 },
        firstVariant: { type: "string", maxLength: 8192, minLength: 1 },
        secondVariant: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["songId", "firstVariant", "secondVariant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "songId",
          label: "Song Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstVariant",
          label: "First Variant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondVariant",
          label: "Second Variant",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicSongStanzaVariantPairTool.execute;
export default publicSongStanzaVariantPairTool;
