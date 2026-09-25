import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly signedOrientation: number;
  readonly thickness: number;
};
export type Output = {
  readonly curvature: number;
  readonly outerInnerArcRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    signedOrientation: { type: "integer" },
    thickness: { type: "number", minimum: 0 },
  },
  required: ["radius", "signedOrientation", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curvature: { type: "number" },
    outerInnerArcRatio: { type: "number" },
  },
  required: ["curvature", "outerInnerArcRatio"],
} as const;
/** Circular mid-surface curvature with a separate thickness-based outer/inner arc ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, signedOrientation, thickness } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(signedOrientation === 1 || signedOrientation === -1);
    H.domain(thickness >= 0 && thickness < 2 * radius);
    return {
      curvature: signedOrientation / radius,
      outerInnerArcRatio: (radius + thickness / 2) / (radius - thickness / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 10, signedOrientation: 1, thickness: 2 },
  output: { curvature: 0.1, outerInnerArcRatio: 1.2222222222222223 },
} satisfies ToolExample<Input, Output>;
export const tissueFoldCurvatureRadiusTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/tissue-fold-curvature-radius-term",
    title: "Tissue Fold Curvature Radius Term Tool",
    description:
      "Circular mid-surface curvature with a separate thickness-based outer/inner arc ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        signedOrientation: { type: "integer" },
        thickness: { type: "number", minimum: 0 },
      },
      required: ["radius", "signedOrientation", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        curvature: { type: "number" },
        outerInnerArcRatio: { type: "number" },
      },
      required: ["curvature", "outerInnerArcRatio"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedOrientation",
          label: "Signed Orientation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "curvature", label: "Curvature", valueType: { type: "number" } },
        {
          id: "outerInnerArcRatio",
          label: "Outer Inner Arc Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueFoldCurvatureRadiusTermTool.execute;
export default tissueFoldCurvatureRadiusTermTool;
