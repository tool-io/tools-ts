import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly escapedText: string };
export type Output = { readonly decodedCharacter: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escapedText: { type: "string", maxLength: 8192 } },
  required: ["escapedText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decodedCharacter: { type: "string", maxLength: 8192 } },
  required: ["decodedCharacter"],
} as const;
/** Decode exactly one RFC 5322 quoted-pair ASCII escape without parsing an address or permitting folded lines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { escapedText } = request;
  const compute = (): Output => {
    H.domain(
      escapedText.length === 2 && escapedText[0] === "\\",
      "escapedText",
    );
    const code = escapedText.charCodeAt(1);
    H.domain(
      code === 9 || code === 32 || (code >= 33 && code <= 126),
      "escapedText",
    );
    return { decodedCharacter: escapedText[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { escapedText: '\\"' },
  output: { decodedCharacter: '"' },
} satisfies ToolExample<Input, Output>;
export const mailQuotedPairSingleEscapeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/mail-quoted-pair-single-escape",
    title: "Mail Quoted Pair Single Escape",
    description:
      "Decode exactly one RFC 5322 quoted-pair ASCII escape without parsing an address or permitting folded lines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { escapedText: { type: "string", maxLength: 8192 } },
      required: ["escapedText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { decodedCharacter: { type: "string", maxLength: 8192 } },
      required: ["decodedCharacter"],
    },
    ports: {
      inputs: [
        {
          id: "escapedText",
          label: "Escaped Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "decodedCharacter",
          label: "Decoded Character",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = mailQuotedPairSingleEscapeTool.execute;
export default mailQuotedPairSingleEscapeTool;
