import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelLength: number;
  readonly rulerPixelsPerUnit: number;
  readonly suppliedPlaneFactor: number;
};
export type Output = {
  readonly nominalLength: number;
  readonly planeCorrectedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelLength: { type: "number", minimum: 0 },
    rulerPixelsPerUnit: { type: "number", exclusiveMinimum: 0 },
    suppliedPlaneFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pixelLength", "rulerPixelsPerUnit", "suppliedPlaneFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalLength: { type: "number" },
    planeCorrectedLength: { type: "number" },
  },
  required: ["nominalLength", "planeCorrectedLength"],
} as const;
/** Measurement arithmetic with a separately supplied image-plane scale correction, not a parallax estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelLength, rulerPixelsPerUnit, suppliedPlaneFactor } = request;
  const compute = (): Output => {
    H.domain(pixelLength >= 0);
    H.positive(rulerPixelsPerUnit);
    H.positive(suppliedPlaneFactor);
    return {
      nominalLength: pixelLength / rulerPixelsPerUnit,
      planeCorrectedLength:
        (pixelLength / rulerPixelsPerUnit) * suppliedPlaneFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pixelLength: 120, rulerPixelsPerUnit: 20, suppliedPlaneFactor: 0.9 },
  output: { nominalLength: 6, planeCorrectedLength: 5.4 },
} satisfies ToolExample<Input, Output>;
export const imageRulerScaleParallaxTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/image-ruler-scale-parallax-term",
    title: "Image Ruler Scale Parallax Term Tool",
    description:
      "Measurement arithmetic with a separately supplied image-plane scale correction, not a parallax estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelLength: { type: "number", minimum: 0 },
        rulerPixelsPerUnit: { type: "number", exclusiveMinimum: 0 },
        suppliedPlaneFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pixelLength", "rulerPixelsPerUnit", "suppliedPlaneFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalLength: { type: "number" },
        planeCorrectedLength: { type: "number" },
      },
      required: ["nominalLength", "planeCorrectedLength"],
    },
    ports: {
      inputs: [
        {
          id: "pixelLength",
          label: "Pixel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rulerPixelsPerUnit",
          label: "Ruler Pixels Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPlaneFactor",
          label: "Supplied Plane Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalLength",
          label: "Nominal Length",
          valueType: { type: "number" },
        },
        {
          id: "planeCorrectedLength",
          label: "Plane Corrected Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imageRulerScaleParallaxTermTool.execute;
export default imageRulerScaleParallaxTermTool;
