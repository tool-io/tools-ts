import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly xSpacing: number;
  readonly ySpacing: number;
  readonly zSpacing: number;
  readonly suppliedLengthUnitFactor: number;
};
export type Output = { readonly voxelVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xSpacing: { type: "number", minimum: 0 },
    ySpacing: { type: "number", minimum: 0 },
    zSpacing: { type: "number", minimum: 0 },
    suppliedLengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["xSpacing", "ySpacing", "zSpacing", "suppliedLengthUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { voxelVolume: { type: "number" } },
  required: ["voxelVolume"],
} as const;
/** Convert supplied rectangular voxel dimensions to target cubic units without reading image metadata or anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { xSpacing, ySpacing, zSpacing, suppliedLengthUnitFactor } = request;
  const compute = (): Output => {
    H.domain(xSpacing >= 0 && ySpacing >= 0 && zSpacing >= 0);
    H.positive(suppliedLengthUnitFactor);
    return {
      voxelVolume:
        xSpacing * ySpacing * zSpacing * suppliedLengthUnitFactor ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    xSpacing: 2,
    ySpacing: 3,
    zSpacing: 4,
    suppliedLengthUnitFactor: 0.1,
  },
  output: { voxelVolume: 0.024000000000000007 },
} satisfies ToolExample<Input, Output>;
export const voxelVolumeUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/voxel-volume-unit-factor",
    title: "Voxel Volume Unit Factor Tool",
    description:
      "Convert supplied rectangular voxel dimensions to target cubic units without reading image metadata or anatomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xSpacing: { type: "number", minimum: 0 },
        ySpacing: { type: "number", minimum: 0 },
        zSpacing: { type: "number", minimum: 0 },
        suppliedLengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "xSpacing",
        "ySpacing",
        "zSpacing",
        "suppliedLengthUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { voxelVolume: { type: "number" } },
      required: ["voxelVolume"],
    },
    ports: {
      inputs: [
        {
          id: "xSpacing",
          label: "X Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ySpacing",
          label: "Y Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zSpacing",
          label: "Z Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLengthUnitFactor",
          label: "Supplied Length Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voxelVolume",
          label: "Voxel Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voxelVolumeUnitFactorTool.execute;
export default voxelVolumeUnitFactorTool;
