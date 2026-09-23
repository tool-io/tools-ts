import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly sum: string; readonly width: number };
export type Output = { readonly word: string; readonly carry: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sum: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["sum", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    carry: { type: "boolean" },
  },
  required: ["word", "carry"],
} as const;
/** Compute ones complement end around carry step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sum, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const s = decimal(sum),
      mask = (1n << BigInt(width)) - 1n;
    domain(s >= 0n && s <= 2n * mask);
    const carry = s > mask;
    return { word: ((s & mask) + (carry ? 1n : 0n)).toString(), carry };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sum: "258", width: 8 },
  output: { word: "3", carry: true },
} satisfies ToolExample<Input, Output>;
export const onesComplementEndAroundCarryStepTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/ones-complement-end-around-carry-step",
  title: "Ones Complement End Around Carry Step Tool",
  description:
    "Compute ones complement end around carry step from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sum",
        label: "Sum",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "word", label: "Word", valueType: { type: "string" } },
      { id: "carry", label: "Carry", valueType: { type: "boolean" } },
    ],
  },
});
export const run = onesComplementEndAroundCarryStepTool.execute;
export default onesComplementEndAroundCarryStepTool;
