import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
export type Input = {
  readonly tokens: readonly string[];
  readonly tokenIndex: number;
};
export type Output = { readonly startByte: number; readonly endByte: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tokenIndex: { type: "integer", minimum: 0 },
  },
  required: ["tokens", "tokenIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { startByte: { type: "integer" }, endByte: { type: "integer" } },
  required: ["startByte", "endByte"],
} as const;
/** Compute UTF-8 byte boundaries in literally concatenated supplied tokens containing complete Unicode scalar values; no model-specific detokenization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, tokenIndex } = request;
  const compute = (): Output => {
    H.integer(tokenIndex, 0, tokens.length - 1);
    for (const token of tokens)
      for (const character of token) {
        const point = character.codePointAt(0);
        H.domain(
          point !== undefined && (point < 0xd800 || point > 0xdfff),
          "tokens",
          "Keep complete Unicode scalar values inside each token.",
        );
      }
    const startByte = tokens
      .slice(0, tokenIndex)
      .reduce((a, b) => a + utf8Encode(b).length, 0);
    return {
      startByte,
      endByte: startByte + utf8Encode(tokens[tokenIndex]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokens: ["A", "é", "🚀"], tokenIndex: 2 },
  output: { startByte: 3, endByte: 7 },
} satisfies ToolExample<Input, Output>;
export const subwordTokenByteOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/subword-token-byte-offset",
    title: "Subword Token Byte Offset Tool",
    description:
      "Compute UTF-8 byte boundaries in literally concatenated supplied tokens containing complete Unicode scalar values; no model-specific detokenization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        tokenIndex: { type: "integer", minimum: 0 },
      },
      required: ["tokens", "tokenIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startByte: { type: "integer" },
        endByte: { type: "integer" },
      },
      required: ["startByte", "endByte"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "tokenIndex",
          label: "Token Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "startByte",
          label: "Start Byte",
          valueType: { type: "integer" },
        },
        { id: "endByte", label: "End Byte", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = subwordTokenByteOffsetTool.execute;
export default subwordTokenByteOffsetTool;
