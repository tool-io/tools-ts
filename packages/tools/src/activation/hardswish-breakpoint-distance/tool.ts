import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = {
  readonly distance: number;
  readonly nearestBreakpoint: number;
  readonly tie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    nearestBreakpoint: { type: "number" },
    tie: { type: "boolean" },
  },
  required: ["distance", "nearestBreakpoint", "tie"],
} as const;
/** Measure distance to the fixed -3 and +3 hard-swish breakpoints, retaining an exact tie flag. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x } = input;
  const compute = (): Output => {
    const left = Math.abs(x + 3),
      right = Math.abs(x - 3);
    return {
      distance: Math.min(left, right),
      nearestBreakpoint: left <= right ? -3 : 3,
      tie: left === right,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 2 },
  output: { distance: 1, nearestBreakpoint: 3, tie: false },
} satisfies ToolExample<Input, Output>;
export const hardswishBreakpointDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/hardswish-breakpoint-distance",
    title: "HardSwish Breakpoint Distance Tool",
    description:
      "Measure distance to the fixed -3 and +3 hard-swish breakpoints, retaining an exact tie flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        nearestBreakpoint: { type: "number" },
        tie: { type: "boolean" },
      },
      required: ["distance", "nearestBreakpoint", "tie"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "nearestBreakpoint",
          label: "Nearest Breakpoint",
          valueType: { type: "number" },
        },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hardswishBreakpointDistanceTool.execute;
export default hardswishBreakpointDistanceTool;
