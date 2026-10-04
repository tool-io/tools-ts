import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly character: string };
export type Output = { readonly digits: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { character: { type: "string", maxLength: 8192 } },
  required: ["character"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
/** Calculate lei checksum letter expansion term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { character } = request;
  const compute = (): Output => {
    H.domain(/^[A-Z0-9](?![\s\S])/.test(character));
    return {
      digits: /^\d(?![\s\S])/.test(character)
        ? character
        : String(character.charCodeAt(0) - 55),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { character: "Z" },
  output: { digits: "35" },
} satisfies ToolExample<Input, Output>;
export const leiChecksumLetterExpansionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/lei-checksum-letter-expansion-term",
    title: "LEI Checksum Letter Expansion Term Tool",
    description:
      "Calculate lei checksum letter expansion term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { character: { type: "string", maxLength: 8192 } },
      required: ["character"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digits: { type: "string", maxLength: 8192 } },
      required: ["digits"],
    },
    ports: {
      inputs: [
        {
          id: "character",
          label: "Character",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "digits", label: "Digits", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = leiChecksumLetterExpansionTermTool.execute;
export default leiChecksumLetterExpansionTermTool;
