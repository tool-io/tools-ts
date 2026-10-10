import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly suppliedSize: string;
  readonly specificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSize: { type: "string", maxLength: 8192, minLength: 1 },
    specificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "suppliedSize", "specificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied pediatric device-size label and source without selecting a device size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, suppliedSize, specificationSource } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(suppliedSize.length > 0, "suppliedSize");
    H.domain(specificationSource.length > 0, "specificationSource");
    return {
      token: JSON.stringify([deviceId, suppliedSize, specificationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "D17",
    suppliedSize: "SIZE-A",
    specificationSource: "Manufacturer sheet",
  },
  output: { token: '["D17","SIZE-A","Manufacturer sheet"]' },
} satisfies ToolExample<Input, Output>;
export const childDeviceSizeSpecLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/child-device-size-spec-label",
    title: "Child Device Size Spec Label",
    description:
      "Record an explicitly supplied pediatric device-size label and source without selecting a device size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSize: { type: "string", maxLength: 8192, minLength: 1 },
        specificationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "suppliedSize", "specificationSource"],
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
          id: "deviceId",
          label: "Device Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSize",
          label: "Supplied Size",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specificationSource",
          label: "Specification Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childDeviceSizeSpecLabelTool.execute;
export default childDeviceSizeSpecLabelTool;
