import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly innerRadius: number;
};
export type Output = {
  readonly radialThickness: number;
  readonly annularArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number" },
    innerRadius: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "innerRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialThickness: { type: "number" },
    annularArea: { type: "number" },
  },
  required: ["radialThickness", "annularArea"],
} as const;
/** Describe a concentric cylindrical annulus by radial thickness and cross-sectional area in consistent length units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, innerRadius } = request;
  const compute = (): Output => {
    H.domain(outerRadius >= innerRadius && innerRadius >= 0, "outerRadius");
    return {
      radialThickness: outerRadius - innerRadius,
      annularArea:
        Math.PI * (outerRadius - innerRadius) * (outerRadius + innerRadius),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 5, innerRadius: 3 },
  output: { radialThickness: 2, annularArea: 50.26548245743669 },
} satisfies ToolExample<Input, Output>;
export const cylinderAnnulusCrossSectionThicknessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/cylinder-annulus-cross-section-thickness",
      title: "Cylinder Annulus Cross Section Thickness Tool",
      description:
        "Describe a concentric cylindrical annulus by radial thickness and cross-sectional area in consistent length units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outerRadius: { type: "number" },
          innerRadius: { type: "number", minimum: 0 },
        },
        required: ["outerRadius", "innerRadius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radialThickness: { type: "number" },
          annularArea: { type: "number" },
        },
        required: ["radialThickness", "annularArea"],
      },
      ports: {
        inputs: [
          {
            id: "outerRadius",
            label: "Outer Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "innerRadius",
            label: "Inner Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "radialThickness",
            label: "Radial Thickness",
            valueType: { type: "number" },
          },
          {
            id: "annularArea",
            label: "Annular Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cylinderAnnulusCrossSectionThicknessTool.execute;
export default cylinderAnnulusCrossSectionThicknessTool;
