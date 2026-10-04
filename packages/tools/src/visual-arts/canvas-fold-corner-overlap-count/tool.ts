import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly margin: number;
};
export type Output = {
  readonly expandedArea: number;
  readonly cornerOverlapArea: number;
  readonly noncornerMarginArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    margin: { type: "number", minimum: 0 },
  },
  required: ["width", "height", "margin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedArea: { type: "number" },
    cornerOverlapArea: { type: "number" },
    noncornerMarginArea: { type: "number" },
  },
  required: ["expandedArea", "cornerOverlapArea", "noncornerMarginArea"],
} as const;
/** Separate the four square corners from the straight margin strips of a rectangular canvas expansion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, margin } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && height >= 0 && margin >= 0);
    return {
      expandedArea: (width + 2 * margin) * (height + 2 * margin),
      cornerOverlapArea: 4 * margin ** 2,
      noncornerMarginArea: 2 * margin * (width + height),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 10, height: 20, margin: 2 },
  output: {
    expandedArea: 336,
    cornerOverlapArea: 16,
    noncornerMarginArea: 120,
  },
} satisfies ToolExample<Input, Output>;
export const canvasFoldCornerOverlapCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/canvas-fold-corner-overlap-count",
    title: "Canvas Fold Corner Overlap Count Tool",
    description:
      "Separate the four square corners from the straight margin strips of a rectangular canvas expansion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        margin: { type: "number", minimum: 0 },
      },
      required: ["width", "height", "margin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedArea: { type: "number" },
        cornerOverlapArea: { type: "number" },
        noncornerMarginArea: { type: "number" },
      },
      required: ["expandedArea", "cornerOverlapArea", "noncornerMarginArea"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "margin",
          label: "Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedArea",
          label: "Expanded Area",
          valueType: { type: "number" },
        },
        {
          id: "cornerOverlapArea",
          label: "Corner Overlap Area",
          valueType: { type: "number" },
        },
        {
          id: "noncornerMarginArea",
          label: "Noncorner Margin Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canvasFoldCornerOverlapCountTool.execute;
export default canvasFoldCornerOverlapCountTool;
