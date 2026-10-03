import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly xSpacing: number;
  readonly ySpacing: number;
  readonly zSpacing: number;
  readonly normalAxis: string;
};
export type Output = { readonly faceArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xSpacing: { type: "number", exclusiveMinimum: 0 },
    ySpacing: { type: "number", exclusiveMinimum: 0 },
    zSpacing: { type: "number", exclusiveMinimum: 0 },
    normalAxis: { type: "string", maxLength: 8192, enum: ["x", "y", "z"] },
  },
  required: ["xSpacing", "ySpacing", "zSpacing", "normalAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { faceArea: { type: "number" } },
  required: ["faceArea"],
} as const;
/** Calculate voxel face area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { xSpacing, ySpacing, zSpacing, normalAxis } = request;
  const compute = (): Output => {
    H.positive(xSpacing);
    H.positive(ySpacing);
    H.positive(zSpacing);
    H.domain(["x", "y", "z"].includes(normalAxis));
    return {
      faceArea:
        normalAxis === "x"
          ? ySpacing * zSpacing
          : normalAxis === "y"
            ? xSpacing * zSpacing
            : xSpacing * ySpacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { xSpacing: 2, ySpacing: 3, zSpacing: 4, normalAxis: "x" },
  output: { faceArea: 12 },
} satisfies ToolExample<Input, Output>;
export const voxelFaceAreaFactorTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "radiology/voxel-face-area-factor",
      title: "Voxel Face Area Factor Tool",
      description:
        "Calculate voxel face area factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          xSpacing: { type: "number", exclusiveMinimum: 0 },
          ySpacing: { type: "number", exclusiveMinimum: 0 },
          zSpacing: { type: "number", exclusiveMinimum: 0 },
          normalAxis: {
            type: "string",
            maxLength: 8192,
            enum: ["x", "y", "z"],
          },
        },
        required: ["xSpacing", "ySpacing", "zSpacing", "normalAxis"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { faceArea: { type: "number" } },
        required: ["faceArea"],
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
            id: "normalAxis",
            label: "Normal Axis",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "faceArea", label: "Face Area", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = voxelFaceAreaFactorTool.execute;
export default voxelFaceAreaFactorTool;
