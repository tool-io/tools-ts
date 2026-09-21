import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly floorArea: number;
  readonly initialDepth: number;
  readonly residualDepth: number;
};
export type Output = {
  readonly initialVolume: number;
  readonly retainedVolume: number;
  readonly drainedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorArea: { type: "number", minimum: 0 },
    initialDepth: { type: "number" },
    residualDepth: { type: "number", minimum: 0 },
  },
  required: ["floorArea", "initialDepth", "residualDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number" },
    retainedVolume: { type: "number" },
    drainedVolume: { type: "number" },
  },
  required: ["initialVolume", "retainedVolume", "drainedVolume"],
} as const;
/** Vertical-wall tank with constant horizontal floor area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { floorArea, initialDepth, residualDepth } = request;
  const compute = (): Output => {
    H.domain(
      floorArea >= 0 && residualDepth >= 0 && initialDepth >= residualDepth,
    );
    return {
      initialVolume: floorArea * initialDepth,
      retainedVolume: floorArea * residualDepth,
      drainedVolume: floorArea * (initialDepth - residualDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { floorArea: 20, initialDepth: 2, residualDepth: 0.1 },
  output: { initialVolume: 40, retainedVolume: 2, drainedVolume: 38 },
} satisfies ToolExample<Input, Output>;
export const aquacultureTankDrainResidualVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/aquaculture-tank-drain-residual-volume",
    title: "Aquaculture Tank Drain Residual Volume Tool",
    description: "Vertical-wall tank with constant horizontal floor area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorArea: { type: "number", minimum: 0 },
        initialDepth: { type: "number" },
        residualDepth: { type: "number", minimum: 0 },
      },
      required: ["floorArea", "initialDepth", "residualDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number" },
        retainedVolume: { type: "number" },
        drainedVolume: { type: "number" },
      },
      required: ["initialVolume", "retainedVolume", "drainedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "floorArea",
          label: "Floor Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialDepth",
          label: "Initial Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualDepth",
          label: "Residual Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          valueType: { type: "number" },
        },
        {
          id: "retainedVolume",
          label: "Retained Volume",
          valueType: { type: "number" },
        },
        {
          id: "drainedVolume",
          label: "Drained Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquacultureTankDrainResidualVolumeTool.execute;
export default aquacultureTankDrainResidualVolumeTool;
