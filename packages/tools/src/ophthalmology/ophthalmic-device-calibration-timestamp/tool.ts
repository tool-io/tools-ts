import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly recordedTimestamp: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedTimestamp: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "recordedTimestamp", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded calibration timestamp text without interpreting validity or setting a service interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, recordedTimestamp, source } = request;
  const compute = (): Output => {
    H.domain(
      deviceId.length > 0 && recordedTimestamp.length > 0 && source.length > 0,
      "deviceId",
    );
    return {
      label:
        deviceId +
        "; calibration=" +
        JSON.stringify(recordedTimestamp) +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "D17",
    recordedTimestamp: "2026-11-01T10:30:00Z",
    source: "Service record",
  },
  output: { label: 'D17; calibration="2026-11-01T10:30:00Z" [Service record]' },
} satisfies ToolExample<Input, Output>;
export const ophthalmicDeviceCalibrationTimestampTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["ophthalmology", "health and medicine"],
        keywords: ["ophthalmology", "health and medicine"],
      },
      id: "ophthalmology/ophthalmic-device-calibration-timestamp",
      title: "Ophthalmic Device Calibration Timestamp",
      description:
        "Label explicitly recorded calibration timestamp text without interpreting validity or setting a service interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deviceId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedTimestamp: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["deviceId", "recordedTimestamp", "source"],
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
            id: "deviceId",
            label: "Device Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordedTimestamp",
            label: "Recorded Timestamp",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ophthalmicDeviceCalibrationTimestampTool.execute;
export default ophthalmicDeviceCalibrationTimestampTool;
