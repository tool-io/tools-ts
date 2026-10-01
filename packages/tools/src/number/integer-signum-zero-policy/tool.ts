import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: number; readonly zeroSign: number };
export type Output = { readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer" },
    zeroSign: { type: "integer", minimum: -1, maximum: 1 },
  },
  required: ["integer", "zeroSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" } },
  required: ["sign"],
} as const;
/** Calculate integer signum zero policy from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { integer, zeroSign } = input;
  const compute = (): Output => {
    H.integer(zeroSign, -1, 1);
    return { sign: integer === 0 ? zeroSign : Math.sign(integer) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { integer: 0, zeroSign: -1 },
  output: { sign: -1 },
} satisfies ToolExample<Input, Output>;
export const integerSignumZeroPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-signum-zero-policy",
    title: "Integer Signum Zero Policy Tool",
    description:
      "Calculate integer signum zero policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer" },
        zeroSign: { type: "integer", minimum: -1, maximum: 1 },
      },
      required: ["integer", "zeroSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" } },
      required: ["sign"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "zeroSign",
          label: "Zero Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "sign", label: "Sign", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = integerSignumZeroPolicyTool.execute;
export default integerSignumZeroPolicyTool;
