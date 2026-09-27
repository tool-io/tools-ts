import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latency: number;
  readonly offset: number;
  readonly logBase: number;
};
export type Output = {
  readonly shiftedLatency: number;
  readonly transformed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latency: { type: "number", minimum: 0 },
    offset: { type: "number" },
    logBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["latency", "offset", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedLatency: { type: "number" },
    transformed: { type: "number" },
  },
  required: ["shiftedLatency", "transformed"],
} as const;
/** Calculate response time log transform offset term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latency, offset, logBase } = request;
  const compute = (): Output => {
    H.domain(
      latency >= 0 && latency + offset > 0 && logBase > 0 && logBase !== 1,
    );
    return {
      shiftedLatency: latency + offset,
      transformed: Math.log(latency + offset) / Math.log(logBase),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latency: 900, offset: 100, logBase: 10 },
  output: { shiftedLatency: 1000, transformed: 2.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const responseTimeLogTransformOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/response-time-log-transform-offset-term",
    title: "Response Time Log Transform Offset Term Tool",
    description:
      "Calculate response time log transform offset term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latency: { type: "number", minimum: 0 },
        offset: { type: "number" },
        logBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["latency", "offset", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedLatency: { type: "number" },
        transformed: { type: "number" },
      },
      required: ["shiftedLatency", "transformed"],
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
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shiftedLatency",
          label: "Shifted Latency",
          valueType: { type: "number" },
        },
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseTimeLogTransformOffsetTermTool.execute;
export default responseTimeLogTransformOffsetTermTool;
