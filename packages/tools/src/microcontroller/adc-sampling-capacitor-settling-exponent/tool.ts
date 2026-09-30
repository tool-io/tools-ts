import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistance: number;
  readonly capacitance: number;
  readonly acquisitionTime: number;
};
export type Output = {
  readonly remainingFraction: number;
  readonly timeConstants: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", exclusiveMinimum: 0 },
    capacitance: { type: "number", exclusiveMinimum: 0 },
    acquisitionTime: { type: "number", minimum: 0 },
  },
  required: ["resistance", "capacitance", "acquisitionTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingFraction: { type: "number" },
    timeConstants: { type: "number" },
  },
  required: ["remainingFraction", "timeConstants"],
} as const;
/** Calculate adc sampling capacitor settling exponent from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { resistance, capacitance, acquisitionTime } = input;
  const compute = (): Output => {
    H.positive(resistance);
    H.positive(capacitance);
    H.domain(acquisitionTime >= 0);
    const timeConstants = acquisitionTime / (resistance * capacitance);
    return { remainingFraction: Math.exp(-timeConstants), timeConstants };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { resistance: 1000, capacitance: 0.000001, acquisitionTime: 0.001 },
  output: { remainingFraction: 0.36787944117144233, timeConstants: 1 },
} satisfies ToolExample<Input, Output>;
export const adcSamplingCapacitorSettlingExponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microcontroller/adc-sampling-capacitor-settling-exponent",
      title: "ADC Sampling Capacitor Settling Exponent Tool",
      description:
        "Calculate adc sampling capacitor settling exponent from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number", exclusiveMinimum: 0 },
          capacitance: { type: "number", exclusiveMinimum: 0 },
          acquisitionTime: { type: "number", minimum: 0 },
        },
        required: ["resistance", "capacitance", "acquisitionTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingFraction: { type: "number" },
          timeConstants: { type: "number" },
        },
        required: ["remainingFraction", "timeConstants"],
      },
      ports: {
        inputs: [
          {
            id: "resistance",
            label: "Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capacitance",
            label: "Capacitance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acquisitionTime",
            label: "Acquisition Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingFraction",
            label: "Remaining Fraction",
            valueType: { type: "number" },
          },
          {
            id: "timeConstants",
            label: "Time Constants",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = adcSamplingCapacitorSettlingExponentTool.execute;
export default adcSamplingCapacitorSettlingExponentTool;
