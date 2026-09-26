import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inputBytes: number };
export type Output = {
  readonly remainderBytes: number;
  readonly paddingCharacters: number;
  readonly unusedBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inputBytes: { type: "integer", minimum: 0 } },
  required: ["inputBytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainderBytes: { type: "integer" },
    paddingCharacters: { type: "integer" },
    unusedBits: { type: "integer" },
  },
  required: ["remainderBytes", "paddingCharacters", "unusedBits"],
} as const;
/** Calculate base64 tail pad bit count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputBytes } = request;
  const compute = (): Output => {
    H.integer(inputBytes, 0);
    return {
      remainderBytes: inputBytes % 3,
      paddingCharacters: inputBytes % 3 === 0 ? 0 : 3 - (inputBytes % 3),
      unusedBits: inputBytes % 3 === 1 ? 4 : inputBytes % 3 === 2 ? 2 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputBytes: 4 },
  output: { remainderBytes: 1, paddingCharacters: 2, unusedBits: 4 },
} satisfies ToolExample<Input, Output>;
export const base64TailPadBitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/base64-tail-pad-bit-count",
    title: "Base64 Tail Pad Bit Count Tool",
    description:
      "Calculate base64 tail pad bit count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inputBytes: { type: "integer", minimum: 0 } },
      required: ["inputBytes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainderBytes: { type: "integer" },
        paddingCharacters: { type: "integer" },
        unusedBits: { type: "integer" },
      },
      required: ["remainderBytes", "paddingCharacters", "unusedBits"],
    },
    ports: {
      inputs: [
        {
          id: "inputBytes",
          label: "Input Bytes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainderBytes",
          label: "Remainder Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "paddingCharacters",
          label: "Padding Characters",
          valueType: { type: "integer" },
        },
        {
          id: "unusedBits",
          label: "Unused Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = base64TailPadBitCountTool.execute;
export default base64TailPadBitCountTool;
