import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly channelId: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "channelId", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit farm sensor channel by supplied unit wording without reading hardware. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, channelId, unitText } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(channelId.length > 0, "channelId");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([deviceId, channelId, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceId: "DEV17", channelId: "CH2", unitText: "kPa" },
  output: { token: '["DEV17","CH2","kPa"]' },
} satisfies ToolExample<Input, Output>;
export const farmSensorChannelUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/farm-sensor-channel-unit",
    title: "Farm Sensor Channel Unit",
    description:
      "Qualify an explicit farm sensor channel by supplied unit wording without reading hardware.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        channelId: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "channelId", "unitText"],
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
          id: "channelId",
          label: "Channel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmSensorChannelUnitTool.execute;
export default farmSensorChannelUnitTool;
