import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly delay: number };
export type Output = {
  readonly leadingZeros: number;
  readonly retained: number;
  readonly discarded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    delay: { type: "integer", minimum: 0 },
  },
  required: ["length", "delay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingZeros: { type: "integer" },
    retained: { type: "integer" },
    discarded: { type: "integer" },
  },
  required: ["leadingZeros", "retained", "discarded"],
} as const;
/** Calculate sequence delay zero padding count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, delay } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(delay, 0);
    const leadingZeros = Math.min(length, delay);
    return {
      leadingZeros,
      retained: length - leadingZeros,
      discarded: leadingZeros,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, delay: 3 },
  output: { leadingZeros: 3, retained: 7, discarded: 3 },
} satisfies ToolExample<Input, Output>;
export const sequenceDelayZeroPaddingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/sequence-delay-zero-padding-count",
    title: "Sequence Delay Zero Padding Count Tool",
    description:
      "Calculate sequence delay zero padding count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        delay: { type: "integer", minimum: 0 },
      },
      required: ["length", "delay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingZeros: { type: "integer" },
        retained: { type: "integer" },
        discarded: { type: "integer" },
      },
      required: ["leadingZeros", "retained", "discarded"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "leadingZeros",
          label: "Leading Zeros",
          valueType: { type: "integer" },
        },
        { id: "retained", label: "Retained", valueType: { type: "integer" } },
        { id: "discarded", label: "Discarded", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = sequenceDelayZeroPaddingCountTool.execute;
export default sequenceDelayZeroPaddingCountTool;
