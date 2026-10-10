import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLimbSide: string;
  readonly deviceSide: string;
};
export type Output = {
  readonly comparable: boolean;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLimbSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
    deviceSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
  },
  required: ["recordedLimbSide", "deviceSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparable: { type: "boolean" }, matches: { type: "boolean" } },
  required: ["comparable", "matches"],
} as const;
/** Compare explicit limb and device side labels without determining fit or clinical suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLimbSide, deviceSide } = request;
  const compute = (): Output => {
    H.domain(
      ["left", "right", "unspecified"].includes(recordedLimbSide),
      "recordedLimbSide",
    );
    H.domain(
      ["left", "right", "unspecified"].includes(deviceSide),
      "deviceSide",
    );
    return {
      comparable:
        recordedLimbSide !== "unspecified" && deviceSide !== "unspecified",
      matches:
        recordedLimbSide !== "unspecified" &&
        deviceSide !== "unspecified" &&
        recordedLimbSide === deviceSide,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLimbSide: "left", deviceSide: "left" },
  output: { comparable: true, matches: true },
} satisfies ToolExample<Input, Output>;
export const orthosisDeviceSideMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/orthosis-device-side-match",
    title: "Orthosis Device Side Match",
    description:
      "Compare explicit limb and device side labels without determining fit or clinical suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLimbSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
        deviceSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
      },
      required: ["recordedLimbSide", "deviceSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        matches: { type: "boolean" },
      },
      required: ["comparable", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedLimbSide",
          label: "Recorded Limb Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deviceSide",
          label: "Device Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = orthosisDeviceSideMatchTool.execute;
export default orthosisDeviceSideMatchTool;
