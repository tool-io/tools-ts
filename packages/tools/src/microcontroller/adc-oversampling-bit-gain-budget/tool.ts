import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly additionalBits: number };
export type Output = { readonly samples: number; readonly shiftBits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { additionalBits: { type: "integer", minimum: 0, maximum: 20 } },
  required: ["additionalBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { samples: { type: "integer" }, shiftBits: { type: "integer" } },
  required: ["samples", "shiftBits"],
} as const;
/** Return ideal independent-noise oversampling sample budget 4^b and decimation shift, without claiming actual ENOB improvement. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { additionalBits } = input;
  const compute = (): Output => {
    H.integer(additionalBits, 0, 20);
    return { samples: 4 ** additionalBits, shiftBits: additionalBits };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { additionalBits: 2 },
  output: { samples: 16, shiftBits: 2 },
} satisfies ToolExample<Input, Output>;
export const adcOversamplingBitGainBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/adc-oversampling-bit-gain-budget",
    title: "ADC Oversampling Bit Gain Budget Tool",
    description:
      "Return ideal independent-noise oversampling sample budget 4^b and decimation shift, without claiming actual ENOB improvement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        additionalBits: { type: "integer", minimum: 0, maximum: 20 },
      },
      required: ["additionalBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samples: { type: "integer" },
        shiftBits: { type: "integer" },
      },
      required: ["samples", "shiftBits"],
    },
    ports: {
      inputs: [
        {
          id: "additionalBits",
          label: "Additional Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "samples", label: "Samples", valueType: { type: "integer" } },
        {
          id: "shiftBits",
          label: "Shift Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = adcOversamplingBitGainBudgetTool.execute;
export default adcOversamplingBitGainBudgetTool;
