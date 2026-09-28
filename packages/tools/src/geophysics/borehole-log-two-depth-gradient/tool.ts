import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDepth: number;
  readonly secondDepth: number;
  readonly firstValue: number;
  readonly secondValue: number;
};
export type Output = {
  readonly depthGap: number;
  readonly gradient: number;
  readonly midpointDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDepth: { type: "number", minimum: 0 },
    secondDepth: { type: "number" },
    firstValue: { type: "number" },
    secondValue: { type: "number" },
  },
  required: ["firstDepth", "secondDepth", "firstValue", "secondValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthGap: { type: "number" },
    gradient: { type: "number" },
    midpointDepth: { type: "number" },
  },
  required: ["depthGap", "gradient", "midpointDepth"],
} as const;
/** Calculate borehole log two depth gradient from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDepth, secondDepth, firstValue, secondValue } = request;
  const compute = (): Output => {
    H.domain(firstDepth >= 0 && secondDepth > firstDepth);
    return {
      depthGap: secondDepth - firstDepth,
      gradient: (secondValue - firstValue) / (secondDepth - firstDepth),
      midpointDepth: (firstDepth + secondDepth) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDepth: 100, secondDepth: 200, firstValue: 20, secondValue: 25 },
  output: { depthGap: 100, gradient: 0.05, midpointDepth: 150 },
} satisfies ToolExample<Input, Output>;
export const boreholeLogTwoDepthGradientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/borehole-log-two-depth-gradient",
    title: "Borehole Log Two Depth Gradient Tool",
    description:
      "Calculate borehole log two depth gradient from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDepth: { type: "number", minimum: 0 },
        secondDepth: { type: "number" },
        firstValue: { type: "number" },
        secondValue: { type: "number" },
      },
      required: ["firstDepth", "secondDepth", "firstValue", "secondValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depthGap: { type: "number" },
        gradient: { type: "number" },
        midpointDepth: { type: "number" },
      },
      required: ["depthGap", "gradient", "midpointDepth"],
    },
    ports: {
      inputs: [
        {
          id: "firstDepth",
          label: "First Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDepth",
          label: "Second Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstValue",
          label: "First Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondValue",
          label: "Second Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "depthGap", label: "Depth Gap", valueType: { type: "number" } },
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        {
          id: "midpointDepth",
          label: "Midpoint Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boreholeLogTwoDepthGradientTool.execute;
export default boreholeLogTwoDepthGradientTool;
