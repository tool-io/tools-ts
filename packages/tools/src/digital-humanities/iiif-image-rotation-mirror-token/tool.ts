import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rotationDegrees: number;
  readonly mirror: boolean;
};
export type Output = { readonly rotationToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rotationDegrees: { type: "number", minimum: 0, maximum: 360 },
    mirror: { type: "boolean" },
  },
  required: ["rotationDegrees", "mirror"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rotationToken: { type: "string", maxLength: 8192 } },
  required: ["rotationToken"],
} as const;
/** Serialize an explicit IIIF image rotation angle in degrees with an optional leading mirror marker without transforming an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rotationDegrees, mirror } = request;
  const compute = (): Output => {
    H.domain(rotationDegrees >= 0 && rotationDegrees <= 360, "rotationDegrees");
    const text = String(rotationDegrees),
      parts = text.split("e-");
    const rotationText =
      parts.length === 2
        ? "0." + "0".repeat(Number(parts[1]) - 1) + parts[0].replace(".", "")
        : text;
    return { rotationToken: (mirror ? "!" : "") + rotationText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rotationDegrees: 90, mirror: true },
  output: { rotationToken: "!90" },
} satisfies ToolExample<Input, Output>;
export const iiifImageRotationMirrorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-image-rotation-mirror-token",
    title: "IIIF Image Rotation Mirror Token Tool",
    description:
      "Serialize an explicit IIIF image rotation angle in degrees with an optional leading mirror marker without transforming an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rotationDegrees: { type: "number", minimum: 0, maximum: 360 },
        mirror: { type: "boolean" },
      },
      required: ["rotationDegrees", "mirror"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rotationToken: { type: "string", maxLength: 8192 } },
      required: ["rotationToken"],
    },
    ports: {
      inputs: [
        {
          id: "rotationDegrees",
          label: "Rotation Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mirror",
          label: "Mirror",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rotationToken",
          label: "Rotation Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifImageRotationMirrorTokenTool.execute;
export default iiifImageRotationMirrorTokenTool;
