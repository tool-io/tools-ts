import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly recordedSide: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "midline", "unspecified"],
    },
  },
  required: ["deviceId", "recordedSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicit device laterality without determining placement or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, recordedSide } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(
      ["left", "right", "bilateral", "midline", "unspecified"].includes(
        recordedSide,
      ),
      "recordedSide",
    );
    return { label: deviceId + " [" + recordedSide + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceId: "D17", recordedSide: "left" },
  output: { label: "D17 [left]" },
} satisfies ToolExample<Input, Output>;
export const urologicalDeviceSideIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/urological-device-side-id",
    title: "Urological Device Side ID",
    description:
      "Attach explicit device laterality without determining placement or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "midline", "unspecified"],
        },
      },
      required: ["deviceId", "recordedSide"],
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
          id: "recordedSide",
          label: "Recorded Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urologicalDeviceSideIdTool.execute;
export default urologicalDeviceSideIdTool;
