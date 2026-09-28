import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerTubeRadius: number;
  readonly innerTubeRadius: number;
  readonly majorRadius: number;
};
export type Output = {
  readonly wallThickness: number;
  readonly holeClearance: number;
  readonly nonSelfIntersecting: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerTubeRadius: { type: "number" },
    innerTubeRadius: { type: "number", minimum: 0 },
    majorRadius: { type: "number", minimum: 0 },
  },
  required: ["outerTubeRadius", "innerTubeRadius", "majorRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallThickness: { type: "number" },
    holeClearance: { type: "number" },
    nonSelfIntersecting: { type: "boolean" },
  },
  required: ["wallThickness", "holeClearance", "nonSelfIntersecting"],
} as const;
/** Tube wall gap and central-hole clearance for supplied concentric torus tube radii. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerTubeRadius, innerTubeRadius, majorRadius } = request;
  const compute = (): Output => {
    H.domain(
      outerTubeRadius >= innerTubeRadius &&
        innerTubeRadius >= 0 &&
        majorRadius >= 0,
    );
    return {
      wallThickness: outerTubeRadius - innerTubeRadius,
      holeClearance: majorRadius - outerTubeRadius,
      nonSelfIntersecting: majorRadius > outerTubeRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerTubeRadius: 3, innerTubeRadius: 2, majorRadius: 10 },
  output: { wallThickness: 1, holeClearance: 7, nonSelfIntersecting: true },
} satisfies ToolExample<Input, Output>;
export const torusTubeWallThicknessGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/torus-tube-wall-thickness-gap",
    title: "Torus Tube Wall Thickness Gap Tool",
    description:
      "Tube wall gap and central-hole clearance for supplied concentric torus tube radii.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerTubeRadius: { type: "number" },
        innerTubeRadius: { type: "number", minimum: 0 },
        majorRadius: { type: "number", minimum: 0 },
      },
      required: ["outerTubeRadius", "innerTubeRadius", "majorRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallThickness: { type: "number" },
        holeClearance: { type: "number" },
        nonSelfIntersecting: { type: "boolean" },
      },
      required: ["wallThickness", "holeClearance", "nonSelfIntersecting"],
    },
    ports: {
      inputs: [
        {
          id: "outerTubeRadius",
          label: "Outer Tube Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerTubeRadius",
          label: "Inner Tube Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "majorRadius",
          label: "Major Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wallThickness",
          label: "Wall Thickness",
          valueType: { type: "number" },
        },
        {
          id: "holeClearance",
          label: "Hole Clearance",
          valueType: { type: "number" },
        },
        {
          id: "nonSelfIntersecting",
          label: "Non Self Intersecting",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = torusTubeWallThicknessGapTool.execute;
export default torusTubeWallThicknessGapTool;
