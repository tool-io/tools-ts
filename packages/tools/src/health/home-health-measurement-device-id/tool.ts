import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly deviceNamespace: string;
  readonly deviceIdentifier: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    deviceNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    deviceIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "deviceNamespace", "deviceIdentifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit home-health measurement device identifier by namespace without authenticating or reading the device. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, deviceNamespace, deviceIdentifier } = request;
  const compute = (): Output => {
    H.domain(measurementId.length > 0, "measurementId");
    H.domain(deviceNamespace.length > 0, "deviceNamespace");
    H.domain(deviceIdentifier.length > 0, "deviceIdentifier");
    return {
      token: JSON.stringify([measurementId, deviceNamespace, deviceIdentifier]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurementId: "M17",
    deviceNamespace: "Maker A",
    deviceIdentifier: "00042",
  },
  output: { token: '["M17","Maker A","00042"]' },
} satisfies ToolExample<Input, Output>;
export const homeHealthMeasurementDeviceIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/home-health-measurement-device-id",
    title: "Home Health Measurement Device ID",
    description:
      "Qualify an explicit home-health measurement device identifier by namespace without authenticating or reading the device.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementId: { type: "string", maxLength: 8192, minLength: 1 },
        deviceNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        deviceIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["measurementId", "deviceNamespace", "deviceIdentifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "measurementId",
          label: "Measurement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deviceNamespace",
          label: "Device Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deviceIdentifier",
          label: "Device Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeHealthMeasurementDeviceIdTool.execute;
export default homeHealthMeasurementDeviceIdTool;
