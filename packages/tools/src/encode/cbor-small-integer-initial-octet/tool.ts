import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number; readonly negative: boolean };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer", minimum: 0, maximum: 23 },
    negative: { type: "boolean" },
  },
  required: ["value", "negative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Compute cbor small integer initial octet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, negative } = input;
  const compute = (): Output => {
    integer(value, 0, 23);
    return { octet: (negative ? 32 : 0) + value };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 5, negative: false },
  output: { octet: 5 },
} satisfies ToolExample<Input, Output>;
export const cborSmallIntegerInitialOctetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/cbor-small-integer-initial-octet",
  title: "CBOR Small Integer Initial Octet Tool",
  description:
    "Compute cbor small integer initial octet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "negative",
        label: "Negative",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [{ id: "octet", label: "Octet", valueType: { type: "integer" } }],
  },
});
export const run = cborSmallIntegerInitialOctetTool.execute;
export default cborSmallIntegerInitialOctetTool;
