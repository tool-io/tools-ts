import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageX: number;
  readonly pageY: number;
  readonly cropLeft: number;
  readonly cropTop: number;
  readonly scale: number;
};
export type Output = { readonly cropX: number; readonly cropY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageX: { type: "number" },
    pageY: { type: "number" },
    cropLeft: { type: "number" },
    cropTop: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pageX", "pageY", "cropLeft", "cropTop", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cropX: { type: "number" }, cropY: { type: "number" } },
  required: ["cropX", "cropY"],
} as const;
/** Page-to-crop coordinate translation followed by uniform scaling, retaining coordinates outside the crop as signed values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageX, pageY, cropLeft, cropTop, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      cropX: (pageX - cropLeft) * scale,
      cropY: (pageY - cropTop) * scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageX: 120, pageY: 80, cropLeft: 20, cropTop: 30, scale: 2 },
  output: { cropX: 200, cropY: 100 },
} satisfies ToolExample<Input, Output>;
export const documentPageImageCropOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/document-page-image-crop-offset",
    title: "Document Page Image Crop Offset Tool",
    description:
      "Page-to-crop coordinate translation followed by uniform scaling, retaining coordinates outside the crop as signed values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageX: { type: "number" },
        pageY: { type: "number" },
        cropLeft: { type: "number" },
        cropTop: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pageX", "pageY", "cropLeft", "cropTop", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cropX: { type: "number" }, cropY: { type: "number" } },
      required: ["cropX", "cropY"],
    },
    ports: {
      inputs: [
        {
          id: "pageX",
          label: "Page X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pageY",
          label: "Page Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropLeft",
          label: "Crop Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropTop",
          label: "Crop Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cropX", label: "Crop X", valueType: { type: "number" } },
        { id: "cropY", label: "Crop Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = documentPageImageCropOffsetTool.execute;
export default documentPageImageCropOffsetTool;
