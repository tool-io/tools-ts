import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly xMicrometersPerPixel: number;
  readonly yMicrometersPerPixel: number;
  readonly targetMicrometersPerUnit: number;
};
export type Output = { readonly targetAreaPerPixel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
    yMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
    targetMicrometersPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "xMicrometersPerPixel",
    "yMicrometersPerPixel",
    "targetMicrometersPerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetAreaPerPixel: { type: "number" } },
  required: ["targetAreaPerPixel"],
} as const;
/** Convert explicit independent slide-pixel axis calibrations to target square units per pixel. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    xMicrometersPerPixel,
    yMicrometersPerPixel,
    targetMicrometersPerUnit,
  } = request;
  const compute = (): Output => {
    H.positive(xMicrometersPerPixel);
    H.positive(yMicrometersPerPixel);
    H.positive(targetMicrometersPerUnit);
    return {
      targetAreaPerPixel:
        (xMicrometersPerPixel * yMicrometersPerPixel) /
        targetMicrometersPerUnit ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    xMicrometersPerPixel: 0.5,
    yMicrometersPerPixel: 0.25,
    targetMicrometersPerUnit: 1000,
  },
  output: { targetAreaPerPixel: 1.25e-7 },
} satisfies ToolExample<Input, Output>;
export const digitalSlidePixelAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/digital-slide-pixel-area-factor",
    title: "Digital Slide Pixel Area Factor Tool",
    description:
      "Convert explicit independent slide-pixel axis calibrations to target square units per pixel.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
        yMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
        targetMicrometersPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "xMicrometersPerPixel",
        "yMicrometersPerPixel",
        "targetMicrometersPerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetAreaPerPixel: { type: "number" } },
      required: ["targetAreaPerPixel"],
    },
    ports: {
      inputs: [
        {
          id: "xMicrometersPerPixel",
          label: "X Micrometers Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yMicrometersPerPixel",
          label: "Y Micrometers Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetMicrometersPerUnit",
          label: "Target Micrometers Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetAreaPerPixel",
          label: "Target Area Per Pixel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = digitalSlidePixelAreaFactorTool.execute;
export default digitalSlidePixelAreaFactorTool;
