import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedHeight: number;
  readonly lengthFactor: number;
  readonly sourceQuantum: number;
};
export type Output = {
  readonly convertedHeight: number;
  readonly convertedQuantum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedHeight: { type: "number", minimum: 0 },
    lengthFactor: { type: "number", exclusiveMinimum: 0 },
    sourceQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedHeight", "lengthFactor", "sourceQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedHeight: { type: "number" },
    convertedQuantum: { type: "number" },
  },
  required: ["convertedHeight", "convertedQuantum"],
} as const;
/** Convert an explicit research height and measurement quantum without growth interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedHeight, lengthFactor, sourceQuantum } = request;
  const compute = (): Output => {
    H.domain(recordedHeight >= 0);
    H.positive(lengthFactor);
    H.positive(sourceQuantum);
    return {
      convertedHeight: recordedHeight * lengthFactor,
      convertedQuantum: sourceQuantum * lengthFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedHeight: 120, lengthFactor: 0.01, sourceQuantum: 0.5 },
  output: { convertedHeight: 1.2, convertedQuantum: 0.005 },
} satisfies ToolExample<Input, Output>;
export const childHeightUnitResolutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-height-unit-resolution",
    title: "Child Height Unit Resolution Tool",
    description:
      "Convert an explicit research height and measurement quantum without growth interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedHeight: { type: "number", minimum: 0 },
        lengthFactor: { type: "number", exclusiveMinimum: 0 },
        sourceQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedHeight", "lengthFactor", "sourceQuantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedHeight: { type: "number" },
        convertedQuantum: { type: "number" },
      },
      required: ["convertedHeight", "convertedQuantum"],
    },
    ports: {
      inputs: [
        {
          id: "recordedHeight",
          label: "Recorded Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lengthFactor",
          label: "Length Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceQuantum",
          label: "Source Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedHeight",
          label: "Converted Height",
          valueType: { type: "number" },
        },
        {
          id: "convertedQuantum",
          label: "Converted Quantum",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childHeightUnitResolutionTool.execute;
export default childHeightUnitResolutionTool;
