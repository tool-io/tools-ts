import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly normalized: number;
  readonly inputMinimum: number;
  readonly inputMaximum: number;
  readonly outputMinimum: number;
  readonly outputMaximum: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    inputMinimum: { type: "number" },
    inputMaximum: { type: "number" },
    outputMinimum: { type: "number" },
    outputMaximum: { type: "number" },
  },
  required: [
    "normalized",
    "inputMinimum",
    "inputMaximum",
    "outputMinimum",
    "outputMaximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Compute minmax output range inversion from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const {
    normalized,
    inputMinimum,
    inputMaximum,
    outputMinimum,
    outputMaximum,
  } = input;
  const compute = (): Output => {
    domain(inputMinimum < inputMaximum && outputMinimum !== outputMaximum);
    return {
      value:
        inputMinimum +
        ((normalized - outputMinimum) / (outputMaximum - outputMinimum)) *
          (inputMaximum - inputMinimum),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    normalized: 0,
    inputMinimum: 10,
    inputMaximum: 20,
    outputMinimum: -1,
    outputMaximum: 1,
  },
  output: { value: 15 },
} satisfies ToolExample<Input, Output>;
export const minmaxOutputRangeInversionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/minmax-output-range-inversion",
  title: "Minmax Output Range Inversion Tool",
  description:
    "Compute minmax output range inversion from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "normalized",
        label: "Normalized",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "inputMinimum",
        label: "Input Minimum",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "inputMaximum",
        label: "Input Maximum",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "outputMinimum",
        label: "Output Minimum",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "outputMaximum",
        label: "Output Maximum",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
  },
});
export const run = minmaxOutputRangeInversionTool.execute;
export default minmaxOutputRangeInversionTool;
