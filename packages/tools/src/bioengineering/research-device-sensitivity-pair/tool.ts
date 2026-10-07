import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly sensitivityText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    sensitivityText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "sensitivityText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit research-device sensitivity transcription and unit without assessing performance or safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, sensitivityText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(sensitivityText.length > 0, "sensitivityText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return { token: JSON.stringify([deviceId, sensitivityText, suppliedUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceId: "D17", sensitivityText: "2.4", suppliedUnit: "mV/kPa" },
  output: { token: '["D17","2.4","mV/kPa"]' },
} satisfies ToolExample<Input, Output>;
export const researchDeviceSensitivityPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/research-device-sensitivity-pair",
    title: "Research Device Sensitivity Pair",
    description:
      "Preserve an explicit research-device sensitivity transcription and unit without assessing performance or safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        sensitivityText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "sensitivityText", "suppliedUnit"],
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
          id: "sensitivityText",
          label: "Sensitivity Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = researchDeviceSensitivityPairTool.execute;
export default researchDeviceSensitivityPairTool;
