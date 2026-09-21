import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly length: number;
  readonly measuredVolume: number;
};
export type Output = {
  readonly geometricVolume: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    measuredVolume: { type: "number", minimum: 0 },
  },
  required: ["radius", "length", "measuredVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geometricVolume: { type: "number" },
    residual: { type: "number" },
  },
  required: ["geometricVolume", "residual"],
} as const;
/** Compare supplied nominal cylindrical core geometry and measured volume without soil-property inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, length, measuredVolume } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && length >= 0 && measuredVolume >= 0);
    return {
      geometricVolume: Math.PI * radius ** 2 * length,
      residual: measuredVolume - Math.PI * radius ** 2 * length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 1, length: 2, measuredVolume: 7 },
  output: { geometricVolume: 6.283185307179586, residual: 0.7168146928204138 },
} satisfies ToolExample<Input, Output>;
export const soilCoreVolumeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-core-volume-residual",
    title: "Soil Core Volume Residual Tool",
    description:
      "Compare supplied nominal cylindrical core geometry and measured volume without soil-property inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
        measuredVolume: { type: "number", minimum: 0 },
      },
      required: ["radius", "length", "measuredVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geometricVolume: { type: "number" },
        residual: { type: "number" },
      },
      required: ["geometricVolume", "residual"],
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
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredVolume",
          label: "Measured Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "geometricVolume",
          label: "Geometric Volume",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilCoreVolumeResidualTool.execute;
export default soilCoreVolumeResidualTool;
