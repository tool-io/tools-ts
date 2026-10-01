import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly digit: number;
  readonly radix: number;
  readonly incomingBorrow: number;
};
export type Output = {
  readonly digit: number;
  readonly outgoingBorrow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digit: { type: "integer", minimum: 0 },
    radix: { type: "integer", minimum: 2, maximum: 36 },
    incomingBorrow: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["digit", "radix", "incomingBorrow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digit: { type: "integer" },
    outgoingBorrow: { type: "integer" },
  },
  required: ["digit", "outgoingBorrow"],
} as const;
/** Calculate radix integer single digit borrow from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { digit, radix, incomingBorrow } = input;
  const compute = (): Output => {
    H.integer(radix, 2, 36);
    H.integer(digit, 0, radix - 1);
    H.integer(incomingBorrow, 0, 1);
    const raw = digit - incomingBorrow;
    return { digit: H.mod(raw, radix), outgoingBorrow: raw < 0 ? 1 : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { digit: 0, radix: 10, incomingBorrow: 1 },
  output: { digit: 9, outgoingBorrow: 1 },
} satisfies ToolExample<Input, Output>;
export const radixIntegerSingleDigitBorrowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/radix-integer-single-digit-borrow",
    title: "Radix Integer Single Digit Borrow Tool",
    description:
      "Calculate radix integer single digit borrow from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digit: { type: "integer", minimum: 0 },
        radix: { type: "integer", minimum: 2, maximum: 36 },
        incomingBorrow: { type: "integer", minimum: 0, maximum: 1 },
      },
      required: ["digit", "radix", "incomingBorrow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digit: { type: "integer" },
        outgoingBorrow: { type: "integer" },
      },
      required: ["digit", "outgoingBorrow"],
    },
    ports: {
      inputs: [
        {
          id: "digit",
          label: "Digit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radix",
          label: "Radix",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "incomingBorrow",
          label: "Incoming Borrow",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "digit", label: "Digit", valueType: { type: "integer" } },
        {
          id: "outgoingBorrow",
          label: "Outgoing Borrow",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = radixIntegerSingleDigitBorrowTool.execute;
export default radixIntegerSingleDigitBorrowTool;
