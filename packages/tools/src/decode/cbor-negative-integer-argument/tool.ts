import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly argument: string };
export type Output = { readonly integer: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { argument: { type: "string", maxLength: 8192 } },
  required: ["argument"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integer: { type: "string", maxLength: 8192 } },
  required: ["integer"],
} as const;
/** Decode a CBOR major-type-one unsigned argument as an exact decimal negative integer. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { argument } = input;
  const compute = (): Output => {
    const n = H.decimal(argument);
    H.domain(n >= 0n && n <= 18446744073709551615n);
    return { integer: String(-1n - n) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { argument: "24" },
  output: { integer: "-25" },
} satisfies ToolExample<Input, Output>;
export const cborNegativeIntegerArgumentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/cbor-negative-integer-argument",
    title: "CBOR Negative Integer Argument Tool",
    description:
      "Decode a CBOR major-type-one unsigned argument as an exact decimal negative integer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { argument: { type: "string", maxLength: 8192 } },
      required: ["argument"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integer: { type: "string", maxLength: 8192 } },
      required: ["integer"],
    },
    ports: {
      inputs: [
        {
          id: "argument",
          label: "Argument",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "integer", label: "Integer", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cborNegativeIntegerArgumentTool.execute;
export default cborNegativeIntegerArgumentTool;
