import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly lotId: string;
  readonly recordSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
    recordSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "lotId", "recordSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied gynecologic device and lot identifiers without assessing device suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, lotId, recordSource } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(lotId.length > 0, "lotId");
    H.domain(recordSource.length > 0, "recordSource");
    return { token: JSON.stringify([deviceId, lotId, recordSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceId: "D17", lotId: "LOT3", recordSource: "Package record" },
  output: { token: '["D17","LOT3","Package record"]' },
} satisfies ToolExample<Input, Output>;
export const gynecologicDeviceLotTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/gynecologic-device-lot-token",
    title: "Gynecologic Device Lot Token",
    description:
      "Record supplied gynecologic device and lot identifiers without assessing device suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
        recordSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "lotId", "recordSource"],
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
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordSource",
          label: "Record Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gynecologicDeviceLotTokenTool.execute;
export default gynecologicDeviceLotTokenTool;
