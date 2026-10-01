import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly reference: number;
  readonly quantum: number;
};
export type Output = {
  readonly difference: number;
  readonly quantumSteps: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number", minimum: 0 },
    reference: { type: "number", minimum: 0 },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measured", "reference", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    quantumSteps: { type: "number" },
  },
  required: ["difference", "quantumSteps"],
} as const;
/** Calculate lesion measurement resolution gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, reference, quantum } = request;
  const compute = (): Output => {
    H.domain(measured >= 0 && reference >= 0);
    H.positive(quantum);
    return {
      difference: measured - reference,
      quantumSteps: (measured - reference) / quantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 12, reference: 10, quantum: 0.5 },
  output: { difference: 2, quantumSteps: 4 },
} satisfies ToolExample<Input, Output>;
export const lesionMeasurementResolutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/lesion-measurement-resolution-gap",
    title: "Lesion Measurement Resolution Gap Tool",
    description:
      "Calculate lesion measurement resolution gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number", minimum: 0 },
        reference: { type: "number", minimum: 0 },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measured", "reference", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        quantumSteps: { type: "number" },
      },
      required: ["difference", "quantumSteps"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "quantumSteps",
          label: "Quantum Steps",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lesionMeasurementResolutionGapTool.execute;
export default lesionMeasurementResolutionGapTool;
