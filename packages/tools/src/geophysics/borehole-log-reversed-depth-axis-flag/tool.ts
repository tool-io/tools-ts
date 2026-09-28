import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDepth: number;
  readonly lastDepth: number;
  readonly expectedIncreasing: boolean;
};
export type Output = {
  readonly increasing: boolean;
  readonly reversed: boolean;
  readonly degenerate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDepth: { type: "number" },
    lastDepth: { type: "number" },
    expectedIncreasing: { type: "boolean" },
  },
  required: ["firstDepth", "lastDepth", "expectedIncreasing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increasing: { type: "boolean" },
    reversed: { type: "boolean" },
    degenerate: { type: "boolean" },
  },
  required: ["increasing", "reversed", "degenerate"],
} as const;
/** Flag the endpoint direction of an explicitly supplied depth axis without reordering or interpreting a log. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDepth, lastDepth, expectedIncreasing } = request;
  const compute = (): Output => {
    const increasing = lastDepth > firstDepth,
      degenerate = lastDepth === firstDepth;
    return {
      increasing,
      reversed: !degenerate && increasing !== expectedIncreasing,
      degenerate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDepth: 100, lastDepth: 0, expectedIncreasing: true },
  output: { increasing: false, reversed: true, degenerate: false },
} satisfies ToolExample<Input, Output>;
export const boreholeLogReversedDepthAxisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/borehole-log-reversed-depth-axis-flag",
    title: "Borehole Log Reversed Depth Axis Flag Tool",
    description:
      "Flag the endpoint direction of an explicitly supplied depth axis without reordering or interpreting a log.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDepth: { type: "number" },
        lastDepth: { type: "number" },
        expectedIncreasing: { type: "boolean" },
      },
      required: ["firstDepth", "lastDepth", "expectedIncreasing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increasing: { type: "boolean" },
        reversed: { type: "boolean" },
        degenerate: { type: "boolean" },
      },
      required: ["increasing", "reversed", "degenerate"],
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
          id: "lastDepth",
          label: "Last Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedIncreasing",
          label: "Expected Increasing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "increasing",
          label: "Increasing",
          valueType: { type: "boolean" },
        },
        { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
        {
          id: "degenerate",
          label: "Degenerate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = boreholeLogReversedDepthAxisFlagTool.execute;
export default boreholeLogReversedDepthAxisFlagTool;
