import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: number;
  readonly right: number;
  readonly incoming: number;
  readonly radix: number;
};
export type Output = { readonly digit: number; readonly carry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer", minimum: 0 },
    right: { type: "integer", minimum: 0 },
    incoming: { type: "integer", minimum: 0, maximum: 1 },
    radix: { type: "integer", minimum: 2, maximum: 256 },
  },
  required: ["left", "right", "incoming", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digit: { type: "integer" }, carry: { type: "integer" } },
  required: ["digit", "carry"],
} as const;
/** Compute positional digit carry single column from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, incoming, radix } = input;
  const compute = (): Output => {
    integer(radix, 2, 256);
    integer(left, 0, radix - 1);
    integer(right, 0, radix - 1);
    integer(incoming, 0, 1);
    const sum = left + right + incoming;
    return { digit: sum % radix, carry: Math.floor(sum / radix) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 8, right: 7, incoming: 1, radix: 10 },
  output: { digit: 6, carry: 1 },
} satisfies ToolExample<Input, Output>;
export const positionalDigitCarrySingleColumnTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/positional-digit-carry-single-column",
  title: "Positional Digit Carry Single Column Tool",
  description:
    "Compute positional digit carry single column from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "incoming",
        label: "Incoming",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "radix",
        label: "Radix",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "digit", label: "Digit", valueType: { type: "integer" } },
      { id: "carry", label: "Carry", valueType: { type: "integer" } },
    ],
  },
});
export const run = positionalDigitCarrySingleColumnTool.execute;
export default positionalDigitCarrySingleColumnTool;
