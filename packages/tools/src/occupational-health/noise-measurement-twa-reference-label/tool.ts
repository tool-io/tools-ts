import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly reportedValue: number;
  readonly unitText: string;
  readonly referenceMethod: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedValue: { type: "number" },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceMethod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "reportedValue", "unitText", "referenceMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit noise metric and reference method without computing a TWA or selecting an exposure criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, reportedValue, unitText, referenceMethod } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && unitText.length > 0 && referenceMethod.length > 0,
      "recordId",
    );
    return {
      label:
        recordId +
        "; " +
        reportedValue +
        " " +
        unitText +
        " [" +
        referenceMethod +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "N17",
    reportedValue: 82,
    unitText: "dB(A)",
    referenceMethod: "Method A",
  },
  output: { label: "N17; 82 dB(A) [Method A]" },
} satisfies ToolExample<Input, Output>;
export const noiseMeasurementTwaReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/noise-measurement-twa-reference-label",
    title: "Noise Measurement TWA Reference Label",
    description:
      "Label an explicit noise metric and reference method without computing a TWA or selecting an exposure criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedValue: { type: "number" },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceMethod: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "reportedValue", "unitText", "referenceMethod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceMethod",
          label: "Reference Method",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = noiseMeasurementTwaReferenceLabelTool.execute;
export default noiseMeasurementTwaReferenceLabelTool;
