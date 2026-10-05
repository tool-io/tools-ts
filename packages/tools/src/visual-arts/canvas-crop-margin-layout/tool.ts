import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly cropLeft: number;
  readonly cropTop: number;
  readonly cropRight: number;
  readonly cropBottom: number;
};
export type Output = {
  readonly croppedWidth: number;
  readonly croppedHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasWidth: { type: "number", minimum: 0 },
    canvasHeight: { type: "number", minimum: 0 },
    cropLeft: { type: "number", minimum: 0 },
    cropTop: { type: "number", minimum: 0 },
    cropRight: { type: "number", minimum: 0 },
    cropBottom: { type: "number", minimum: 0 },
  },
  required: [
    "canvasWidth",
    "canvasHeight",
    "cropLeft",
    "cropTop",
    "cropRight",
    "cropBottom",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    croppedWidth: { type: "number" },
    croppedHeight: { type: "number" },
  },
  required: ["croppedWidth", "croppedHeight"],
} as const;
/** Calculate a rectangular canvas crop from four explicit nonnegative edge margins. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    canvasWidth,
    canvasHeight,
    cropLeft,
    cropTop,
    cropRight,
    cropBottom,
  } = request;
  const compute = (): Output => {
    H.domain(
      canvasWidth >= 0 &&
        canvasHeight >= 0 &&
        cropLeft >= 0 &&
        cropTop >= 0 &&
        cropRight >= 0 &&
        cropBottom >= 0 &&
        cropLeft + cropRight <= canvasWidth &&
        cropTop + cropBottom <= canvasHeight,
      "canvasWidth",
    );
    return {
      croppedWidth: canvasWidth - cropLeft - cropRight,
      croppedHeight: canvasHeight - cropTop - cropBottom,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    canvasWidth: 100,
    canvasHeight: 80,
    cropLeft: 10,
    cropTop: 5,
    cropRight: 20,
    cropBottom: 15,
  },
  output: { croppedWidth: 70, croppedHeight: 60 },
} satisfies ToolExample<Input, Output>;
export const canvasCropMarginLayoutTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/canvas-crop-margin-layout",
    title: "Canvas Crop Margin Layout Tool",
    description:
      "Calculate a rectangular canvas crop from four explicit nonnegative edge margins.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canvasWidth: { type: "number", minimum: 0 },
        canvasHeight: { type: "number", minimum: 0 },
        cropLeft: { type: "number", minimum: 0 },
        cropTop: { type: "number", minimum: 0 },
        cropRight: { type: "number", minimum: 0 },
        cropBottom: { type: "number", minimum: 0 },
      },
      required: [
        "canvasWidth",
        "canvasHeight",
        "cropLeft",
        "cropTop",
        "cropRight",
        "cropBottom",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        croppedWidth: { type: "number" },
        croppedHeight: { type: "number" },
      },
      required: ["croppedWidth", "croppedHeight"],
    },
    ports: {
      inputs: [
        {
          id: "canvasWidth",
          label: "Canvas Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canvasHeight",
          label: "Canvas Height",
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
          id: "cropRight",
          label: "Crop Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropBottom",
          label: "Crop Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "croppedWidth",
          label: "Cropped Width",
          valueType: { type: "number" },
        },
        {
          id: "croppedHeight",
          label: "Cropped Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canvasCropMarginLayoutTool.execute;
export default canvasCropMarginLayoutTool;
