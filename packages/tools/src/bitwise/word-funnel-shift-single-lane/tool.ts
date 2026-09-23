import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly high: number;
  readonly low: number;
  readonly shift: number;
  readonly width: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer", minimum: 0 },
    low: { type: "integer", minimum: 0 },
    shift: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["high", "low", "shift", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Return the low-width lane of the concatenated high/low words shifted logically right. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { high, low, shift, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    const max = 2 ** width - 1;
    H.integer(high, 0, max);
    H.integer(low, 0, max);
    H.integer(shift, 0, width);
    const joined = (BigInt(high) << BigInt(width)) | BigInt(low);
    return { value: Number((joined >> BigInt(shift)) & BigInt(max)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { high: 10, low: 5, shift: 4, width: 8 },
  output: { value: 160 },
} satisfies ToolExample<Input, Output>;
export const wordFunnelShiftSingleLaneTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/word-funnel-shift-single-lane",
    title: "Word Funnel Shift Single Lane Tool",
    description:
      "Return the low-width lane of the concatenated high/low words shifted logically right.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        high: { type: "integer", minimum: 0 },
        low: { type: "integer", minimum: 0 },
        shift: { type: "integer", minimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["high", "low", "shift", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "high",
          label: "High",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "low",
          label: "Low",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = wordFunnelShiftSingleLaneTool.execute;
export default wordFunnelShiftSingleLaneTool;
