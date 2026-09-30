import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slope: number;
  readonly sourceSpan: number;
  readonly targetSpan: number;
};
export type Output = {
  readonly scaledSlope: number;
  readonly orientationReversed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    sourceSpan: { type: "number" },
    targetSpan: { type: "number" },
  },
  required: ["slope", "sourceSpan", "targetSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledSlope: { type: "number" },
    orientationReversed: { type: "boolean" },
  },
  required: ["scaledSlope", "orientationReversed"],
} as const;
/** Transform a Hermite derivative under an explicitly oriented affine coordinate change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slope, sourceSpan, targetSpan } = request;
  const compute = (): Output => {
    H.domain(sourceSpan !== 0 && targetSpan !== 0);
    return {
      scaledSlope: (slope * sourceSpan) / targetSpan,
      orientationReversed: Math.sign(sourceSpan) !== Math.sign(targetSpan),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slope: 3, sourceSpan: 2, targetSpan: 4 },
  output: { scaledSlope: 1.5, orientationReversed: false },
} satisfies ToolExample<Input, Output>;
export const hermiteSlopeScaleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/hermite-slope-scale-sign",
    title: "Hermite Slope Scale Sign Tool",
    description:
      "Transform a Hermite derivative under an explicitly oriented affine coordinate change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        sourceSpan: { type: "number" },
        targetSpan: { type: "number" },
      },
      required: ["slope", "sourceSpan", "targetSpan"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledSlope: { type: "number" },
        orientationReversed: { type: "boolean" },
      },
      required: ["scaledSlope", "orientationReversed"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceSpan",
          label: "Source Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetSpan",
          label: "Target Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledSlope",
          label: "Scaled Slope",
          valueType: { type: "number" },
        },
        {
          id: "orientationReversed",
          label: "Orientation Reversed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hermiteSlopeScaleSignTool.execute;
export default hermiteSlopeScaleSignTool;
