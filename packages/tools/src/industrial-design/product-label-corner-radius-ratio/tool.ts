import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cornerRadius: number;
  readonly labelShortSide: number;
};
export type Output = {
  readonly radiusToShortSideRatio: number;
  readonly exceedsHalfSide: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cornerRadius: { type: "number", minimum: 0 },
    labelShortSide: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cornerRadius", "labelShortSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radiusToShortSideRatio: { type: "number" },
    exceedsHalfSide: { type: "boolean" },
  },
  required: ["radiusToShortSideRatio", "exceedsHalfSide"],
} as const;
/** Compare an explicit product-label corner radius to its short side, flagging a radius above half that side without modifying it. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cornerRadius, labelShortSide } = request;
  const compute = (): Output => {
    H.domain(cornerRadius >= 0, "cornerRadius");
    (H.domain(
      Number.isFinite(labelShortSide) && labelShortSide > 0,
      "labelShortSide",
    ),
      labelShortSide);
    return {
      radiusToShortSideRatio: cornerRadius / labelShortSide,
      exceedsHalfSide: cornerRadius > labelShortSide / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cornerRadius: 3, labelShortSide: 20 },
  output: { radiusToShortSideRatio: 0.15, exceedsHalfSide: false },
} satisfies ToolExample<Input, Output>;
export const productLabelCornerRadiusRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/product-label-corner-radius-ratio",
    title: "Product Label Corner Radius Ratio",
    description:
      "Compare an explicit product-label corner radius to its short side, flagging a radius above half that side without modifying it.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cornerRadius: { type: "number", minimum: 0 },
        labelShortSide: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cornerRadius", "labelShortSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radiusToShortSideRatio: { type: "number" },
        exceedsHalfSide: { type: "boolean" },
      },
      required: ["radiusToShortSideRatio", "exceedsHalfSide"],
    },
    ports: {
      inputs: [
        {
          id: "cornerRadius",
          label: "Corner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelShortSide",
          label: "Label Short Side",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiusToShortSideRatio",
          label: "Radius To Short Side Ratio",
          valueType: { type: "number" },
        },
        {
          id: "exceedsHalfSide",
          label: "Exceeds Half Side",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = productLabelCornerRadiusRatioTool.execute;
export default productLabelCornerRadiusRatioTool;
