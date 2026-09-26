import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedFactor: number;
  readonly referenceValue: number;
};
export type Output = {
  readonly convertedValue: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedFactor: { type: "number", exclusiveMinimum: 0 },
    referenceValue: { type: "number" },
  },
  required: ["reportedValue", "suppliedFactor", "referenceValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedValue: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["convertedValue", "referenceGap"],
} as const;
/** Convert supplied research assay units with an explicit factor without assigning reference ranges or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, suppliedFactor, referenceValue } = request;
  const compute = (): Output => {
    H.positive(suppliedFactor);
    return {
      convertedValue: reportedValue * suppliedFactor,
      referenceGap: reportedValue * suppliedFactor - referenceValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedValue: 10, suppliedFactor: 2, referenceValue: 18 },
  output: { convertedValue: 20, referenceGap: 2 },
} satisfies ToolExample<Input, Output>;
export const assayUnitReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/assay-unit-reference-factor",
    title: "Assay Unit Reference Factor Tool",
    description:
      "Convert supplied research assay units with an explicit factor without assigning reference ranges or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        suppliedFactor: { type: "number", exclusiveMinimum: 0 },
        referenceValue: { type: "number" },
      },
      required: ["reportedValue", "suppliedFactor", "referenceValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedValue: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["convertedValue", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceValue",
          label: "Reference Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedValue",
          label: "Converted Value",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayUnitReferenceFactorTool.execute;
export default assayUnitReferenceFactorTool;
