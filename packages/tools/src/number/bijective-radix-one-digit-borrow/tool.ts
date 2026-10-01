import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: number; readonly radix: number };
export type Output = { readonly quotient: number; readonly digit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "integer", minimum: 1 },
    radix: { type: "integer", minimum: 2, maximum: 36 },
  },
  required: ["integer", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotient: { type: "integer" }, digit: { type: "integer" } },
  required: ["quotient", "digit"],
} as const;
/** Calculate bijective radix one digit borrow from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer, radix } = request;
  const compute = (): Output => {
    H.integer(integer, 1);
    H.integer(radix, 2, 36);
    return {
      quotient: Math.floor((integer - 1) / radix),
      digit: ((integer - 1) % radix) + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: 26, radix: 26 },
  output: { quotient: 0, digit: 26 },
} satisfies ToolExample<Input, Output>;
export const bijectiveRadixOneDigitBorrowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/bijective-radix-one-digit-borrow",
    title: "Bijective Radix One Digit Borrow Tool",
    description:
      "Calculate bijective radix one digit borrow from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "integer", minimum: 1 },
        radix: { type: "integer", minimum: 2, maximum: 36 },
      },
      required: ["integer", "radix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quotient: { type: "integer" }, digit: { type: "integer" } },
      required: ["quotient", "digit"],
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
          id: "radix",
          label: "Radix",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "quotient", label: "Quotient", valueType: { type: "integer" } },
        { id: "digit", label: "Digit", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bijectiveRadixOneDigitBorrowTool.execute;
export default bijectiveRadixOneDigitBorrowTool;
