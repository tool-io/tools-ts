import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly border: number;
};
export type Output = {
  readonly borderArea: number;
  readonly borderShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    border: { type: "number", minimum: 0 },
  },
  required: ["width", "height", "border"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borderArea: { type: "number" },
    borderShare: { type: "number" },
  },
  required: ["borderArea", "borderShare"],
} as const;
/** Compute a uniform inward rectangular canvas border area and fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, border } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(height);
    H.domain(border >= 0 && 2 * border <= Math.min(width, height));
    return {
      borderArea: width * height - (width - 2 * border) * (height - 2 * border),
      borderShare:
        1 - ((width - 2 * border) * (height - 2 * border)) / (width * height),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 10, height: 8, border: 1 },
  output: { borderArea: 32, borderShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const canvasBorderAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/canvas-border-area-share",
    title: "Canvas Border Area Share Tool",
    description:
      "Compute a uniform inward rectangular canvas border area and fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        border: { type: "number", minimum: 0 },
      },
      required: ["width", "height", "border"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borderArea: { type: "number" },
        borderShare: { type: "number" },
      },
      required: ["borderArea", "borderShare"],
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
          id: "border",
          label: "Border",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "borderArea",
          label: "Border Area",
          valueType: { type: "number" },
        },
        {
          id: "borderShare",
          label: "Border Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canvasBorderAreaShareTool.execute;
export default canvasBorderAreaShareTool;
