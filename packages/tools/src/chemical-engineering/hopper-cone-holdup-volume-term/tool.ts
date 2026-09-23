import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topRadius: number;
  readonly outletRadius: number;
  readonly height: number;
  readonly bulkDensity: number;
};
export type Output = { readonly volume: number; readonly mass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topRadius: { type: "number" },
    outletRadius: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    bulkDensity: { type: "number", minimum: 0 },
  },
  required: ["topRadius", "outletRadius", "height", "bulkDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" }, mass: { type: "number" } },
  required: ["volume", "mass"],
} as const;
/** Conical-frustum geometric inventory; flow pattern, bridging and unfilled dead zones are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topRadius, outletRadius, height, bulkDensity } = request;
  const compute = (): Output => {
    H.domain(
      outletRadius >= 0 &&
        topRadius >= outletRadius &&
        height >= 0 &&
        bulkDensity >= 0,
    );
    return {
      volume:
        (Math.PI *
          height *
          (topRadius ** 2 + topRadius * outletRadius + outletRadius ** 2)) /
        3,
      mass:
        (Math.PI *
          height *
          (topRadius ** 2 + topRadius * outletRadius + outletRadius ** 2) *
          bulkDensity) /
        3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topRadius: 2, outletRadius: 1, height: 3, bulkDensity: 2 },
  output: { volume: 21.991148575128552, mass: 43.982297150257104 },
} satisfies ToolExample<Input, Output>;
export const hopperConeHoldupVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/hopper-cone-holdup-volume-term",
    title: "Hopper Cone Holdup Volume Term Tool",
    description:
      "Conical-frustum geometric inventory; flow pattern, bridging and unfilled dead zones are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topRadius: { type: "number" },
        outletRadius: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        bulkDensity: { type: "number", minimum: 0 },
      },
      required: ["topRadius", "outletRadius", "height", "bulkDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" }, mass: { type: "number" } },
      required: ["volume", "mass"],
    },
    ports: {
      inputs: [
        {
          id: "topRadius",
          label: "Top Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletRadius",
          label: "Outlet Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bulkDensity",
          label: "Bulk Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
        { id: "mass", label: "Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hopperConeHoldupVolumeTermTool.execute;
export default hopperConeHoldupVolumeTermTool;
