import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly deviceType: string;
  readonly unit: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    deviceType: {
      type: "string",
      maxLength: 8192,
      enum: [
        "laboratory",
        "capillary-meter",
        "continuous-monitor",
        "other",
        "unknown",
      ],
    },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "deviceType", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicit glucose-record device and unit metadata without converting values or recommending a clinical response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, deviceType, unit } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && unit.length > 0, "recordId");
    H.domain(
      [
        "laboratory",
        "capillary-meter",
        "continuous-monitor",
        "other",
        "unknown",
      ].includes(deviceType),
      "deviceType",
    );
    return { tag: recordId + " [" + deviceType + "; " + unit + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", deviceType: "capillary-meter", unit: "mmol/L" },
  output: { tag: "R17 [capillary-meter; mmol/L]" },
} satisfies ToolExample<Input, Output>;
export const glucoseRecordMeasurementDeviceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/glucose-record-measurement-device-tag",
    title: "Glucose Record Measurement Device Tag",
    description:
      "Label explicit glucose-record device and unit metadata without converting values or recommending a clinical response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        deviceType: {
          type: "string",
          maxLength: 8192,
          enum: [
            "laboratory",
            "capillary-meter",
            "continuous-monitor",
            "other",
            "unknown",
          ],
        },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "deviceType", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
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
          id: "deviceType",
          label: "Device Type",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glucoseRecordMeasurementDeviceTagTool.execute;
export default glucoseRecordMeasurementDeviceTagTool;
