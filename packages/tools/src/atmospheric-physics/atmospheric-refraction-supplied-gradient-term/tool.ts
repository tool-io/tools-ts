import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly refractiveIndex: number;
  readonly verticalGradient: number;
  readonly pathLength: number;
};
export type Output = {
  readonly curvature: number;
  readonly smallAngleDeflection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refractiveIndex: { type: "number", exclusiveMinimum: 0 },
    verticalGradient: { type: "number" },
    pathLength: { type: "number", minimum: 0 },
  },
  required: ["refractiveIndex", "verticalGradient", "pathLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curvature: { type: "number" },
    smallAngleDeflection: { type: "number" },
  },
  required: ["curvature", "smallAngleDeflection"],
} as const;
/** Local near-horizontal ray curvature n-gradient/n and first-order signed deflection; no standard-atmosphere refraction table is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { refractiveIndex, verticalGradient, pathLength } = request;
  const compute = (): Output => {
    H.positive(refractiveIndex);
    H.domain(pathLength >= 0);
    return {
      curvature: verticalGradient / refractiveIndex,
      smallAngleDeflection: (pathLength * verticalGradient) / refractiveIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { refractiveIndex: 1, verticalGradient: -0.000001, pathLength: 1000 },
  output: { curvature: -0.000001, smallAngleDeflection: -0.001 },
} satisfies ToolExample<Input, Output>;
export const atmosphericRefractionSuppliedGradientTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/atmospheric-refraction-supplied-gradient-term",
      title: "Atmospheric Refraction Supplied Gradient Term Tool",
      description:
        "Local near-horizontal ray curvature n-gradient/n and first-order signed deflection; no standard-atmosphere refraction table is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          refractiveIndex: { type: "number", exclusiveMinimum: 0 },
          verticalGradient: { type: "number" },
          pathLength: { type: "number", minimum: 0 },
        },
        required: ["refractiveIndex", "verticalGradient", "pathLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          curvature: { type: "number" },
          smallAngleDeflection: { type: "number" },
        },
        required: ["curvature", "smallAngleDeflection"],
      },
      ports: {
        inputs: [
          {
            id: "refractiveIndex",
            label: "Refractive Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "verticalGradient",
            label: "Vertical Gradient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pathLength",
            label: "Path Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "curvature",
            label: "Curvature",
            valueType: { type: "number" },
          },
          {
            id: "smallAngleDeflection",
            label: "Small Angle Deflection",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = atmosphericRefractionSuppliedGradientTermTool.execute;
export default atmosphericRefractionSuppliedGradientTermTool;
