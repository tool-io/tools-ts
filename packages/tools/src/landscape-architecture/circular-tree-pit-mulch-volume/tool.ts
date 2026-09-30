import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitRadius: number;
  readonly trunkClearRadius: number;
  readonly depth: number;
};
export type Output = { readonly area: number; readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitRadius: { type: "number" },
    trunkClearRadius: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
  },
  required: ["pitRadius", "trunkClearRadius", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, volume: { type: "number" } },
  required: ["area", "volume"],
} as const;
/** Calculate circular tree pit mulch volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitRadius, trunkClearRadius, depth } = request;
  const compute = (): Output => {
    H.domain(
      trunkClearRadius >= 0 && pitRadius >= trunkClearRadius && depth >= 0,
    );
    return {
      area: Math.PI * (pitRadius ** 2 - trunkClearRadius ** 2),
      volume: Math.PI * (pitRadius ** 2 - trunkClearRadius ** 2) * depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitRadius: 2, trunkClearRadius: 1, depth: 0.1 },
  output: { area: 9.42477796076938, volume: 0.9424777960769379 },
} satisfies ToolExample<Input, Output>;
export const circularTreePitMulchVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/circular-tree-pit-mulch-volume",
    title: "Circular Tree Pit Mulch Volume Tool",
    description:
      "Calculate circular tree pit mulch volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitRadius: { type: "number" },
        trunkClearRadius: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
      },
      required: ["pitRadius", "trunkClearRadius", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" }, volume: { type: "number" } },
      required: ["area", "volume"],
    },
    ports: {
      inputs: [
        {
          id: "pitRadius",
          label: "Pit Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trunkClearRadius",
          label: "Trunk Clear Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = circularTreePitMulchVolumeTool.execute;
export default circularTreePitMulchVolumeTool;
