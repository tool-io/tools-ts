import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly exposure: number; readonly reference: number };
export type Output = { readonly decibels: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exposure", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decibels: { type: "number" } },
  required: ["decibels"],
} as const;
/** Express positive sound exposure relative to an explicitly supplied reference using ten log10. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { exposure, reference } = input;
  const compute = (): Output => {
    H.positive(exposure);
    H.positive(reference);
    return { decibels: 10 * Math.log10(exposure / reference) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exposure: 100, reference: 1 },
  output: { decibels: 20 },
} satisfies ToolExample<Input, Output>;
export const soundExposureLinearLogReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/sound-exposure-linear-log-reference",
    title: "Sound Exposure Linear Log Reference Tool",
    description:
      "Express positive sound exposure relative to an explicitly supplied reference using ten log10.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposure: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exposure", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { decibels: { type: "number" } },
      required: ["decibels"],
    },
    ports: {
      inputs: [
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "decibels", label: "Decibels", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soundExposureLinearLogReferenceTool.execute;
export default soundExposureLinearLogReferenceTool;
