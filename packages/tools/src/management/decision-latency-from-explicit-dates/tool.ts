import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestTime: number;
  readonly decisionTime: number;
  readonly pausedDuration: number;
};
export type Output = {
  readonly elapsed: number;
  readonly activeLatency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestTime: { type: "number" },
    decisionTime: { type: "number" },
    pausedDuration: { type: "number", minimum: 0 },
  },
  required: ["requestTime", "decisionTime", "pausedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeLatency: { type: "number" },
  },
  required: ["elapsed", "activeLatency"],
} as const;
/** Calculate decision latency from explicit dates from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestTime, decisionTime, pausedDuration } = request;
  const compute = (): Output => {
    H.domain(
      decisionTime >= requestTime &&
        pausedDuration >= 0 &&
        pausedDuration <= decisionTime - requestTime,
    );
    return {
      elapsed: decisionTime - requestTime,
      activeLatency: decisionTime - requestTime - pausedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestTime: 10, decisionTime: 40, pausedDuration: 5 },
  output: { elapsed: 30, activeLatency: 25 },
} satisfies ToolExample<Input, Output>;
export const decisionLatencyFromExplicitDatesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/decision-latency-from-explicit-dates",
    title: "Decision Latency From Explicit Dates Tool",
    description:
      "Calculate decision latency from explicit dates from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestTime: { type: "number" },
        decisionTime: { type: "number" },
        pausedDuration: { type: "number", minimum: 0 },
      },
      required: ["requestTime", "decisionTime", "pausedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeLatency: { type: "number" },
      },
      required: ["elapsed", "activeLatency"],
    },
    ports: {
      inputs: [
        {
          id: "requestTime",
          label: "Request Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "decisionTime",
          label: "Decision Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedDuration",
          label: "Paused Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeLatency",
          label: "Active Latency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = decisionLatencyFromExplicitDatesTool.execute;
export default decisionLatencyFromExplicitDatesTool;
