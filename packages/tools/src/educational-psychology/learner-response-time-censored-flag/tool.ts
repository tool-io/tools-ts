import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latency: number;
  readonly timeout: number;
  readonly equalityCensored: boolean;
};
export type Output = {
  readonly recordedLatency: number;
  readonly censored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latency: { type: "number", minimum: 0 },
    timeout: { type: "number", exclusiveMinimum: 0 },
    equalityCensored: { type: "boolean" },
  },
  required: ["latency", "timeout", "equalityCensored"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLatency: { type: "number" },
    censored: { type: "boolean" },
  },
  required: ["recordedLatency", "censored"],
} as const;
/** Calculate learner response time censored flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latency, timeout, equalityCensored } = request;
  const compute = (): Output => {
    H.domain(latency >= 0);
    H.positive(timeout);
    return {
      recordedLatency: Math.min(latency, timeout),
      censored: equalityCensored ? latency >= timeout : latency > timeout,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latency: 12, timeout: 10, equalityCensored: true },
  output: { recordedLatency: 10, censored: true },
} satisfies ToolExample<Input, Output>;
export const learnerResponseTimeCensoredFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/learner-response-time-censored-flag",
    title: "Learner Response Time Censored Flag Tool",
    description:
      "Calculate learner response time censored flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latency: { type: "number", minimum: 0 },
        timeout: { type: "number", exclusiveMinimum: 0 },
        equalityCensored: { type: "boolean" },
      },
      required: ["latency", "timeout", "equalityCensored"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLatency: { type: "number" },
        censored: { type: "boolean" },
      },
      required: ["recordedLatency", "censored"],
    },
    ports: {
      inputs: [
        {
          id: "latency",
          label: "Latency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeout",
          label: "Timeout",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityCensored",
          label: "Equality Censored",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedLatency",
          label: "Recorded Latency",
          valueType: { type: "number" },
        },
        { id: "censored", label: "Censored", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = learnerResponseTimeCensoredFlagTool.execute;
export default learnerResponseTimeCensoredFlagTool;
