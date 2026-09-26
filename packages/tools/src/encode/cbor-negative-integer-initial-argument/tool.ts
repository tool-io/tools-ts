import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: string };
export type Output = { readonly argument: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integer: { type: "string", maxLength: 8192 } },
  required: ["integer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { argument: { type: "string", maxLength: 8192 } },
  required: ["argument"],
} as const;
/** Calculate cbor negative integer initial argument from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { integer } = input;
  const compute = (): Output => {
    const n = H.decimal(integer);
    H.domain(n < 0n && n >= -18446744073709551616n);
    return { argument: String(-1n - n) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { integer: "-25" },
  output: { argument: "24" },
} satisfies ToolExample<Input, Output>;
export const cborNegativeIntegerInitialArgumentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/cbor-negative-integer-initial-argument",
    title: "CBOR Negative Integer Initial Argument Tool",
    description:
      "Calculate cbor negative integer initial argument from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integer: { type: "string", maxLength: 8192 } },
      required: ["integer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { argument: { type: "string", maxLength: 8192 } },
      required: ["argument"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "argument", label: "Argument", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cborNegativeIntegerInitialArgumentTool.execute;
export default cborNegativeIntegerInitialArgumentTool;
