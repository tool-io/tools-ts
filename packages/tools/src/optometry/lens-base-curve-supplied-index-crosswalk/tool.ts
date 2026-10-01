import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceSurfacePower: number;
  readonly referenceIndex: number;
  readonly targetIndex: number;
};
export type Output = {
  readonly targetSurfacePower: number;
  readonly curvaturePerMeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceSurfacePower: { type: "number" },
    referenceIndex: { type: "number", exclusiveMinimum: 0 },
    targetIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceSurfacePower", "referenceIndex", "targetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetSurfacePower: { type: "number" },
    curvaturePerMeter: { type: "number" },
  },
  required: ["targetSurfacePower", "curvaturePerMeter"],
} as const;
/** Same-curvature refracting-surface power under explicitly supplied indices, without selecting a lens base curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceSurfacePower, referenceIndex, targetIndex } = request;
  const compute = (): Output => {
    H.domain(referenceIndex !== 1 && targetIndex > 0 && referenceIndex > 0);
    return {
      targetSurfacePower:
        (referenceSurfacePower * (targetIndex - 1)) / (referenceIndex - 1),
      curvaturePerMeter: referenceSurfacePower / (referenceIndex - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceSurfacePower: 5, referenceIndex: 1.5, targetIndex: 1.6 },
  output: { targetSurfacePower: 6.000000000000001, curvaturePerMeter: 10 },
} satisfies ToolExample<Input, Output>;
export const lensBaseCurveSuppliedIndexCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/lens-base-curve-supplied-index-crosswalk",
      title: "Lens Base Curve Supplied Index Crosswalk Tool",
      description:
        "Same-curvature refracting-surface power under explicitly supplied indices, without selecting a lens base curve.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceSurfacePower: { type: "number" },
          referenceIndex: { type: "number", exclusiveMinimum: 0 },
          targetIndex: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["referenceSurfacePower", "referenceIndex", "targetIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetSurfacePower: { type: "number" },
          curvaturePerMeter: { type: "number" },
        },
        required: ["targetSurfacePower", "curvaturePerMeter"],
      },
      ports: {
        inputs: [
          {
            id: "referenceSurfacePower",
            label: "Reference Surface Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceIndex",
            label: "Reference Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetIndex",
            label: "Target Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "targetSurfacePower",
            label: "Target Surface Power",
            valueType: { type: "number" },
          },
          {
            id: "curvaturePerMeter",
            label: "Curvature Per Meter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lensBaseCurveSuppliedIndexCrosswalkTool.execute;
export default lensBaseCurveSuppliedIndexCrosswalkTool;
