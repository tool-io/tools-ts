import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly width: number;
  readonly meanDepth: number;
};
export type Output = { readonly area: number; readonly meanVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    width: { type: "number", exclusiveMinimum: 0 },
    meanDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flow", "width", "meanDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, meanVelocity: { type: "number" } },
  required: ["area", "meanVelocity"],
} as const;
/** Compute mean velocity for a supplied rectangular flow cross-section; signed discharge determines direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, width, meanDepth } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(meanDepth);
    return {
      area: width * meanDepth,
      meanVelocity: flow / (width * meanDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 12, width: 3, meanDepth: 2 },
  output: { area: 6, meanVelocity: 2 },
} satisfies ToolExample<Input, Output>;
export const flowDepthAreaFactorTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "hydrology/flow-depth-area-factor",
      title: "Flow Depth Area Factor Tool",
      description:
        "Compute mean velocity for a supplied rectangular flow cross-section; signed discharge determines direction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flow: { type: "number" },
          width: { type: "number", exclusiveMinimum: 0 },
          meanDepth: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["flow", "width", "meanDepth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number" },
          meanVelocity: { type: "number" },
        },
        required: ["area", "meanVelocity"],
      },
      ports: {
        inputs: [
          {
            id: "flow",
            label: "Flow",
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
            id: "meanDepth",
            label: "Mean Depth",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "area", label: "Area", valueType: { type: "number" } },
          {
            id: "meanVelocity",
            label: "Mean Velocity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = flowDepthAreaFactorTool.execute;
export default flowDepthAreaFactorTool;
