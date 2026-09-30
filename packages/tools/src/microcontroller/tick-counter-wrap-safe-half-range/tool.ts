import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bits: number; readonly delta: number };
export type Output = {
  readonly halfRange: number;
  readonly unambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bits: { type: "integer", minimum: 2, maximum: 32 },
    delta: { type: "integer", minimum: 0 },
  },
  required: ["bits", "delta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    halfRange: { type: "integer" },
    unambiguous: { type: "boolean" },
  },
  required: ["halfRange", "unambiguous"],
} as const;
/** Calculate tick counter wrap safe half range from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { bits, delta } = input;
  const compute = (): Output => {
    H.integer(bits, 2, 32);
    H.integer(delta, 0, 2 ** bits - 1);
    const halfRange = 2 ** (bits - 1);
    return { halfRange, unambiguous: delta < halfRange };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bits: 8, delta: 127 },
  output: { halfRange: 128, unambiguous: true },
} satisfies ToolExample<Input, Output>;
export const tickCounterWrapSafeHalfRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/tick-counter-wrap-safe-half-range",
    title: "Tick Counter Wrap Safe Half Range Tool",
    description:
      "Calculate tick counter wrap safe half range from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bits: { type: "integer", minimum: 2, maximum: 32 },
        delta: { type: "integer", minimum: 0 },
      },
      required: ["bits", "delta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        halfRange: { type: "integer" },
        unambiguous: { type: "boolean" },
      },
      required: ["halfRange", "unambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delta",
          label: "Delta",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "halfRange",
          label: "Half Range",
          valueType: { type: "integer" },
        },
        {
          id: "unambiguous",
          label: "Unambiguous",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = tickCounterWrapSafeHalfRangeTool.execute;
export default tickCounterWrapSafeHalfRangeTool;
