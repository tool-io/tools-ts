import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerDiameter: number;
  readonly innerDiameter: number;
};
export type Output = {
  readonly totalArea: number;
  readonly medullaryArea: number;
  readonly corticalArea: number;
  readonly corticalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerDiameter: { type: "number", exclusiveMinimum: 0 },
    innerDiameter: { type: "number", minimum: 0 },
  },
  required: ["outerDiameter", "innerDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number" },
    medullaryArea: { type: "number" },
    corticalArea: { type: "number" },
    corticalFraction: { type: "number" },
  },
  required: ["totalArea", "medullaryArea", "corticalArea", "corticalFraction"],
} as const;
/** Circular concentric annulus area approximation from supplied model diameters, not an image-derived cortical measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerDiameter, innerDiameter } = request;
  const compute = (): Output => {
    H.positive(outerDiameter);
    H.domain(innerDiameter >= 0 && innerDiameter <= outerDiameter);
    return {
      totalArea: (Math.PI * outerDiameter ** 2) / 4,
      medullaryArea: (Math.PI * innerDiameter ** 2) / 4,
      corticalArea: (Math.PI * (outerDiameter ** 2 - innerDiameter ** 2)) / 4,
      corticalFraction: 1 - (innerDiameter / outerDiameter) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerDiameter: 10, innerDiameter: 6 },
  output: {
    totalArea: 78.53981633974483,
    medullaryArea: 28.274333882308138,
    corticalArea: 50.26548245743669,
    corticalFraction: 0.64,
  },
} satisfies ToolExample<Input, Output>;
export const boneCorticalMedullaryAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/bone-cortical-medullary-area-share",
    title: "Bone Cortical Medullary Area Share Tool",
    description:
      "Circular concentric annulus area approximation from supplied model diameters, not an image-derived cortical measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerDiameter: { type: "number", exclusiveMinimum: 0 },
        innerDiameter: { type: "number", minimum: 0 },
      },
      required: ["outerDiameter", "innerDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number" },
        medullaryArea: { type: "number" },
        corticalArea: { type: "number" },
        corticalFraction: { type: "number" },
      },
      required: [
        "totalArea",
        "medullaryArea",
        "corticalArea",
        "corticalFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "outerDiameter",
          label: "Outer Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerDiameter",
          label: "Inner Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
        {
          id: "medullaryArea",
          label: "Medullary Area",
          valueType: { type: "number" },
        },
        {
          id: "corticalArea",
          label: "Cortical Area",
          valueType: { type: "number" },
        },
        {
          id: "corticalFraction",
          label: "Cortical Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boneCorticalMedullaryAreaShareTool.execute;
export default boneCorticalMedullaryAreaShareTool;
