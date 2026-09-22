import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseLatency: number;
  readonly windowDuration: number;
};
export type Output = {
  readonly fraction: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseLatency: { type: "number" },
    windowDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["responseLatency", "windowDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["fraction", "withinWindow"],
} as const;
/** Calculate response window latency factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseLatency, windowDuration } = request;
  const compute = (): Output => {
    H.positive(windowDuration);
    return {
      fraction: responseLatency / windowDuration,
      withinWindow: responseLatency >= 0 && responseLatency <= windowDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseLatency: 150, windowDuration: 300 },
  output: { fraction: 0.5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const responseWindowLatencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/response-window-latency-factor",
    title: "Response Window Latency Factor Tool",
    description:
      "Calculate response window latency factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseLatency: { type: "number" },
        windowDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["responseLatency", "windowDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["fraction", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "responseLatency",
          label: "Response Latency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowDuration",
          label: "Window Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseWindowLatencyFactorTool.execute;
export default responseWindowLatencyFactorTool;
