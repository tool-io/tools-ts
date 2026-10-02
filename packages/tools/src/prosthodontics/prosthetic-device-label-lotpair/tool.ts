import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly lotId: string;
  readonly labelDevice: string;
  readonly labelLot: string;
  readonly source: string;
};
export type Output = {
  readonly deviceMatches: boolean;
  readonly lotMatches: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192 },
    lotId: { type: "string", maxLength: 8192 },
    labelDevice: { type: "string", maxLength: 8192 },
    labelLot: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["deviceId", "lotId", "labelDevice", "labelLot", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceMatches: { type: "boolean" },
    lotMatches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["deviceMatches", "lotMatches", "key"],
} as const;
/** Compare supplied prosthetic device and lot identifiers with source context. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, lotId, labelDevice, labelLot, source } = request;
  const compute = (): Output => {
    H.domain(
      [deviceId, lotId, labelDevice, labelLot, source].every(
        (x) => x.length > 0,
      ),
    );
    return {
      deviceMatches: deviceId === labelDevice,
      lotMatches: lotId === labelLot,
      key: JSON.stringify([source, deviceId, lotId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "D1",
    lotId: "L1",
    labelDevice: "D1",
    labelLot: "L1",
    source: "registry",
  },
  output: {
    deviceMatches: true,
    lotMatches: true,
    key: '["registry","D1","L1"]',
  },
} satisfies ToolExample<Input, Output>;
export const prostheticDeviceLabelLotpairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthetic-device-label-lotpair",
    title: "Prosthetic Device Label Lotpair Tool",
    description:
      "Compare supplied prosthetic device and lot identifiers with source context.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192 },
        lotId: { type: "string", maxLength: 8192 },
        labelDevice: { type: "string", maxLength: 8192 },
        labelLot: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["deviceId", "lotId", "labelDevice", "labelLot", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceMatches: { type: "boolean" },
        lotMatches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["deviceMatches", "lotMatches", "key"],
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
          id: "labelDevice",
          label: "Label Device",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelLot",
          label: "Label Lot",
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
        {
          id: "deviceMatches",
          label: "Device Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "lotMatches",
          label: "Lot Matches",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = prostheticDeviceLabelLotpairTool.execute;
export default prostheticDeviceLabelLotpairTool;
