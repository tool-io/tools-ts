import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestTime: number;
  readonly responseTime: number;
  readonly pausedTime: number;
};
export type Output = {
  readonly elapsed: number;
  readonly countedDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestTime: { type: "number" },
    responseTime: { type: "number" },
    pausedTime: { type: "number", minimum: 0 },
  },
  required: ["requestTime", "responseTime", "pausedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, countedDelay: { type: "number" } },
  required: ["elapsed", "countedDelay"],
} as const;
/** Administrative access-request timing with explicit pause accounting, without evaluating entitlement or urgency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestTime, responseTime, pausedTime } = request;
  const compute = (): Output => {
    H.domain(
      responseTime >= requestTime &&
        pausedTime >= 0 &&
        pausedTime <= responseTime - requestTime,
    );
    return {
      elapsed: responseTime - requestTime,
      countedDelay: responseTime - requestTime - pausedTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestTime: 10, responseTime: 40, pausedTime: 5 },
  output: { elapsed: 30, countedDelay: 25 },
} satisfies ToolExample<Input, Output>;
export const accessRequestResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/access-request-response-delay",
    title: "Access Request Response Delay Tool",
    description:
      "Administrative access-request timing with explicit pause accounting, without evaluating entitlement or urgency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestTime: { type: "number" },
        responseTime: { type: "number" },
        pausedTime: { type: "number", minimum: 0 },
      },
      required: ["requestTime", "responseTime", "pausedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        countedDelay: { type: "number" },
      },
      required: ["elapsed", "countedDelay"],
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
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedTime",
          label: "Paused Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "countedDelay",
          label: "Counted Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessRequestResponseDelayTool.execute;
export default accessRequestResponseDelayTool;
