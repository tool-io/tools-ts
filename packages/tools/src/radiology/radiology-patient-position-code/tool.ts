import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly recordedCode: string;
  readonly allowedCodes: readonly string[];
};
export type Output = { readonly label: string; readonly listed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    allowedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["imageId", "recordedCode", "allowedCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    listed: { type: "boolean" },
  },
  required: ["label", "listed"],
} as const;
/** Label a recorded patient-position code and check a supplied code list without inferring orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, recordedCode, allowedCodes } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0 && recordedCode.length > 0, "imageId");
    return {
      label: imageId + " [" + recordedCode + "]",
      listed: allowedCodes.includes(recordedCode),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "IMG17",
    recordedCode: "HFS",
    allowedCodes: ["HFS", "FFS"],
  },
  output: { label: "IMG17 [HFS]", listed: true },
} satisfies ToolExample<Input, Output>;
export const radiologyPatientPositionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/radiology-patient-position-code",
    title: "Radiology Patient Position Code",
    description:
      "Label a recorded patient-position code and check a supplied code list without inferring orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
        allowedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["imageId", "recordedCode", "allowedCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        listed: { type: "boolean" },
      },
      required: ["label", "listed"],
    },
    ports: {
      inputs: [
        {
          id: "imageId",
          label: "Image Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedCodes",
          label: "Allowed Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = radiologyPatientPositionCodeTool.execute;
export default radiologyPatientPositionCodeTool;
