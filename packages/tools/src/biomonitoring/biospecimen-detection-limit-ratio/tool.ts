import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedLimit: number;
  readonly sourceScale: number;
};
export type Output = {
  readonly convertedValue: number;
  readonly limitRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedLimit: { type: "number", exclusiveMinimum: 0 },
    sourceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedValue", "suppliedLimit", "sourceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedValue: { type: "number" },
    limitRatio: { type: "number" },
  },
  required: ["convertedValue", "limitRatio"],
} as const;
/** Compare supplied signed research measurements to an explicit assay limit without a health-risk interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, suppliedLimit, sourceScale } = request;
  const compute = (): Output => {
    H.positive(suppliedLimit);
    H.positive(sourceScale);
    return {
      convertedValue: reportedValue * sourceScale,
      limitRatio: (reportedValue * sourceScale) / suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedValue: 2, suppliedLimit: 1, sourceScale: 2 },
  output: { convertedValue: 4, limitRatio: 4 },
} satisfies ToolExample<Input, Output>;
export const biospecimenDetectionLimitRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biospecimen-detection-limit-ratio",
    title: "Biospecimen Detection Limit Ratio Tool",
    description:
      "Compare supplied signed research measurements to an explicit assay limit without a health-risk interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        suppliedLimit: { type: "number", exclusiveMinimum: 0 },
        sourceScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedValue", "suppliedLimit", "sourceScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedValue: { type: "number" },
        limitRatio: { type: "number" },
      },
      required: ["convertedValue", "limitRatio"],
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
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceScale",
          label: "Source Scale",
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
          id: "limitRatio",
          label: "Limit Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biospecimenDetectionLimitRatioTool.execute;
export default biospecimenDetectionLimitRatioTool;
