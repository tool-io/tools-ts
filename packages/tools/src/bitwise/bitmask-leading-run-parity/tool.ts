import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly word: string;
  readonly width: number;
  readonly bitValue: number;
};
export type Output = { readonly runLength: number; readonly odd: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 256 },
    bitValue: { type: "integer" },
  },
  required: ["word", "width", "bitValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { runLength: { type: "integer" }, odd: { type: "boolean" } },
  required: ["runLength", "odd"],
} as const;
/** Calculate bitmask leading run parity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { word, width, bitValue } = request;
  const compute = (): Output => {
    H.integer(width, 1, 256);
    H.domain(bitValue === 0 || bitValue === 1);
    const n = H.decimal(word);
    H.domain(n >= 0n && n < 1n << BigInt(width));
    let runLength = 0;
    for (let i = width - 1; i >= 0; i--) {
      if (Number((n >> BigInt(i)) & 1n) !== bitValue) break;
      runLength++;
    }
    return { runLength, odd: runLength % 2 === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { word: "240", width: 8, bitValue: 1 },
  output: { runLength: 4, odd: false },
} satisfies ToolExample<Input, Output>;
export const bitmaskLeadingRunParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitmask-leading-run-parity",
    title: "Bitmask Leading Run Parity Tool",
    description:
      "Calculate bitmask leading run parity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "string", maxLength: 8192 },
        width: { type: "integer", minimum: 1, maximum: 256 },
        bitValue: { type: "integer" },
      },
      required: ["word", "width", "bitValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { runLength: { type: "integer" }, odd: { type: "boolean" } },
      required: ["runLength", "odd"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bitValue",
          label: "Bit Value",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "runLength",
          label: "Run Length",
          valueType: { type: "integer" },
        },
        { id: "odd", label: "Odd", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bitmaskLeadingRunParityTool.execute;
export default bitmaskLeadingRunParityTool;
