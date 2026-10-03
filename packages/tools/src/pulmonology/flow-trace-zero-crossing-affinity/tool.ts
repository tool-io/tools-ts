import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: number;
  readonly after: number;
  readonly includeZeroDeparture: boolean;
  readonly includeZeroArrival: boolean;
};
export type Output = { readonly upward: boolean; readonly downward: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    includeZeroDeparture: { type: "boolean" },
    includeZeroArrival: { type: "boolean" },
  },
  required: ["before", "after", "includeZeroDeparture", "includeZeroArrival"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { upward: { type: "boolean" }, downward: { type: "boolean" } },
  required: ["upward", "downward"],
} as const;
/** Classify one supplied adjacent flow pair under explicit zero arrival/departure conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after, includeZeroDeparture, includeZeroArrival } = request;
  const compute = (): Output => {
    return {
      upward:
        (before < 0 && after > 0) ||
        (includeZeroDeparture && before === 0 && after > 0) ||
        (includeZeroArrival && before < 0 && after === 0),
      downward:
        (before > 0 && after < 0) ||
        (includeZeroDeparture && before === 0 && after < 0) ||
        (includeZeroArrival && before > 0 && after === 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    before: 0,
    after: 2,
    includeZeroDeparture: true,
    includeZeroArrival: false,
  },
  output: { upward: true, downward: false },
} satisfies ToolExample<Input, Output>;
export const flowTraceZeroCrossingAffinityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/flow-trace-zero-crossing-affinity",
    title: "Flow Trace Zero Crossing Affinity Tool",
    description:
      "Classify one supplied adjacent flow pair under explicit zero arrival/departure conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "number" },
        after: { type: "number" },
        includeZeroDeparture: { type: "boolean" },
        includeZeroArrival: { type: "boolean" },
      },
      required: [
        "before",
        "after",
        "includeZeroDeparture",
        "includeZeroArrival",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upward: { type: "boolean" },
        downward: { type: "boolean" },
      },
      required: ["upward", "downward"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeZeroDeparture",
          label: "Include Zero Departure",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeZeroArrival",
          label: "Include Zero Arrival",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "upward", label: "Upward", valueType: { type: "boolean" } },
        { id: "downward", label: "Downward", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = flowTraceZeroCrossingAffinityTool.execute;
export default flowTraceZeroCrossingAffinityTool;
