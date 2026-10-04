import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string };
export type Output = { readonly body: string; readonly checkCharacter: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    body: { type: "string", maxLength: 8192 },
    checkCharacter: { type: "string", maxLength: 8192 },
  },
  required: ["body", "checkCharacter"],
} as const;
/** Compute isni check character position from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    domain(/^\d{15}[\dX](?![\s\S])/.test(identifier));
    return { body: identifier.slice(0, 15), checkCharacter: identifier[15] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "0000000218250097" },
  output: { body: "000000021825009", checkCharacter: "7" },
} satisfies ToolExample<Input, Output>;
export const isniCheckCharacterPositionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/isni-check-character-position",
  title: "ISNI Check Character Position Tool",
  description:
    "Compute isni check character position from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "body", label: "Body", valueType: { type: "string" } },
      {
        id: "checkCharacter",
        label: "Check Character",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = isniCheckCharacterPositionTool.execute;
export default isniCheckCharacterPositionTool;
