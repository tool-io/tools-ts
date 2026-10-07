import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerReferenceSeconds: number;
  readonly imageCaptureSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerReferenceSeconds: { type: "number" },
    imageCaptureSeconds: { type: "number" },
  },
  required: ["layerReferenceSeconds", "imageCaptureSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit layer-reference timestamp from image-capture time in seconds without detecting layer features. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerReferenceSeconds, imageCaptureSeconds } = request;
  const compute = (): Output => {
    return { signedGap: imageCaptureSeconds - layerReferenceSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerReferenceSeconds: 12, imageCaptureSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const printLayerImageTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/print-layer-image-time-offset",
    title: "Print Layer Image Time Offset",
    description:
      "Subtract an explicit layer-reference timestamp from image-capture time in seconds without detecting layer features.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerReferenceSeconds: { type: "number" },
        imageCaptureSeconds: { type: "number" },
      },
      required: ["layerReferenceSeconds", "imageCaptureSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "layerReferenceSeconds",
          label: "Layer Reference Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageCaptureSeconds",
          label: "Image Capture Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = printLayerImageTimeOffsetTool.execute;
export default printLayerImageTimeOffsetTool;
