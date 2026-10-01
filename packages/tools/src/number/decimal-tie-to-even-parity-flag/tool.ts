import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedDigit: number;
  readonly discardedDigits: string;
};
export type Output = { readonly tie: boolean; readonly increment: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedDigit: { type: "integer", minimum: 0, maximum: 9 },
    discardedDigits: { type: "string", maxLength: 8192 },
  },
  required: ["retainedDigit", "discardedDigits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tie: { type: "boolean" }, increment: { type: "boolean" } },
  required: ["tie", "increment"],
} as const;
/** Calculate decimal tie to even parity flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { retainedDigit, discardedDigits } = input;
  const compute = (): Output => {
    H.integer(retainedDigit, 0, 9);
    H.domain(/^\d+(?![\s\S])/.test(discardedDigits));
    const tie = /^50*(?![\s\S])/.test(discardedDigits);
    return { tie, increment: tie && retainedDigit % 2 === 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { retainedDigit: 3, discardedDigits: "500" },
  output: { tie: true, increment: true },
} satisfies ToolExample<Input, Output>;
export const decimalTieToEvenParityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/decimal-tie-to-even-parity-flag",
    title: "Decimal Tie To Even Parity Flag Tool",
    description:
      "Calculate decimal tie to even parity flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedDigit: { type: "integer", minimum: 0, maximum: 9 },
        discardedDigits: { type: "string", maxLength: 8192 },
      },
      required: ["retainedDigit", "discardedDigits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tie: { type: "boolean" }, increment: { type: "boolean" } },
      required: ["tie", "increment"],
    },
    ports: {
      inputs: [
        {
          id: "retainedDigit",
          label: "Retained Digit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "discardedDigits",
          label: "Discarded Digits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
        { id: "increment", label: "Increment", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = decimalTieToEvenParityFlagTool.execute;
export default decimalTieToEvenParityFlagTool;
