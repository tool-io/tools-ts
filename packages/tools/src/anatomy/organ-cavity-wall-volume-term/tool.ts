import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly innerRadius: number;
  readonly length: number;
};
export type Output = {
  readonly outerVolume: number;
  readonly cavityVolume: number;
  readonly wallVolume: number;
  readonly wallFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number", exclusiveMinimum: 0 },
    innerRadius: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "innerRadius", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerVolume: { type: "number" },
    cavityVolume: { type: "number" },
    wallVolume: { type: "number" },
    wallFraction: { type: "number" },
  },
  required: ["outerVolume", "cavityVolume", "wallVolume", "wallFraction"],
} as const;
/** Ideal concentric cylindrical wall and cavity geometry, excluding caps and noncircular anatomical form. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, innerRadius, length } = request;
  const compute = (): Output => {
    H.positive(outerRadius);
    H.domain(innerRadius >= 0 && innerRadius <= outerRadius && length >= 0);
    return {
      outerVolume: Math.PI * outerRadius ** 2 * length,
      cavityVolume: Math.PI * innerRadius ** 2 * length,
      wallVolume: Math.PI * (outerRadius ** 2 - innerRadius ** 2) * length,
      wallFraction: 1 - (innerRadius / outerRadius) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 3, innerRadius: 2, length: 5 },
  output: {
    outerVolume: 141.3716694115407,
    cavityVolume: 62.83185307179586,
    wallVolume: 78.53981633974483,
    wallFraction: 0.5555555555555556,
  },
} satisfies ToolExample<Input, Output>;
export const organCavityWallVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/organ-cavity-wall-volume-term",
    title: "Organ Cavity Wall Volume Term Tool",
    description:
      "Ideal concentric cylindrical wall and cavity geometry, excluding caps and noncircular anatomical form.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerRadius: { type: "number", exclusiveMinimum: 0 },
        innerRadius: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
      },
      required: ["outerRadius", "innerRadius", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerVolume: { type: "number" },
        cavityVolume: { type: "number" },
        wallVolume: { type: "number" },
        wallFraction: { type: "number" },
      },
      required: ["outerVolume", "cavityVolume", "wallVolume", "wallFraction"],
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
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outerVolume",
          label: "Outer Volume",
          valueType: { type: "number" },
        },
        {
          id: "cavityVolume",
          label: "Cavity Volume",
          valueType: { type: "number" },
        },
        {
          id: "wallVolume",
          label: "Wall Volume",
          valueType: { type: "number" },
        },
        {
          id: "wallFraction",
          label: "Wall Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = organCavityWallVolumeTermTool.execute;
export default organCavityWallVolumeTermTool;
