import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly angleDegrees: number;
  readonly referenceWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    angleDegrees: { type: "number" },
    referenceWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "angleDegrees", "referenceWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied articulator angle and reference convention without selecting device settings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, angleDegrees, referenceWording } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0 && referenceWording.length > 0, "deviceId");
    return {
      label: deviceId + "; " + angleDegrees + "° [" + referenceWording + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "A17",
    angleDegrees: 30,
    referenceWording: "recorded reference A",
  },
  output: { label: "A17; 30° [recorded reference A]" },
} satisfies ToolExample<Input, Output>;
export const articulatorAngleReferenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/articulator-angle-reference-tag",
    title: "Articulator Angle Reference Tag",
    description:
      "Label an explicitly supplied articulator angle and reference convention without selecting device settings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        angleDegrees: { type: "number" },
        referenceWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "angleDegrees", "referenceWording"],
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
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceWording",
          label: "Reference Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = articulatorAngleReferenceTagTool.execute;
export default articulatorAngleReferenceTagTool;
