import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = { readonly value: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "boolean" } },
  required: ["value"],
} as const;
/** Compute der boolean value octet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    domain(
      octet === 0 || octet === 255,
      "octet",
      "DER Boolean must be 00 or FF.",
    );
    return { value: octet === 255 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 255 },
  output: { value: true },
} satisfies ToolExample<Input, Output>;
export const derBooleanValueOctetTool = defineSchemaCalculation<Input, Output>({
  id: "decode/der-boolean-value-octet",
  title: "DER Boolean Value Octet Tool",
  description: "Compute der boolean value octet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "octet",
        label: "Octet",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "boolean" } }],
  },
});
export const run = derBooleanValueOctetTool.execute;
export default derBooleanValueOctetTool;
