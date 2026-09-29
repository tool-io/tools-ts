import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeFlow: number;
  readonly width: number;
  readonly depth: number;
};
export type Output = { readonly meanVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeFlow: { type: "number", minimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
    depth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumeFlow", "width", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanVelocity: { type: "number" } },
  required: ["meanVelocity"],
} as const;
/** Calculate hydroponic bench channel flow velocity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeFlow, width, depth } = request;
  const compute = (): Output => {
    H.domain(volumeFlow >= 0);
    H.positive(width);
    H.positive(depth);
    return { meanVelocity: volumeFlow / (width * depth) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeFlow: 0.002, width: 0.2, depth: 0.01 },
  output: { meanVelocity: 1 },
} satisfies ToolExample<Input, Output>;
export const hydroponicBenchChannelFlowVelocityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-bench-channel-flow-velocity",
    title: "Hydroponic Bench Channel Flow Velocity Tool",
    description:
      "Calculate hydroponic bench channel flow velocity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeFlow: { type: "number", minimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
        depth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumeFlow", "width", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meanVelocity: { type: "number" } },
      required: ["meanVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "volumeFlow",
          label: "Volume Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
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
        {
          id: "meanVelocity",
          label: "Mean Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicBenchChannelFlowVelocityTool.execute;
export default hydroponicBenchChannelFlowVelocityTool;
