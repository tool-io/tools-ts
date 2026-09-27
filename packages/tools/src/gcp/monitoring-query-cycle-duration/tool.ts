import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openedAt: number;
  readonly closedAt: number;
  readonly pausedDuration: number;
};
export type Output = {
  readonly elapsed: number;
  readonly activeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openedAt: { type: "number" },
    closedAt: { type: "number" },
    pausedDuration: { type: "number", minimum: 0 },
  },
  required: ["openedAt", "closedAt", "pausedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeDuration: { type: "number" },
  },
  required: ["elapsed", "activeDuration"],
} as const;
/** Calculate monitoring query cycle duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openedAt, closedAt, pausedDuration } = request;
  const compute = (): Output => {
    H.domain(
      closedAt >= openedAt &&
        pausedDuration >= 0 &&
        pausedDuration <= closedAt - openedAt,
    );
    return {
      elapsed: closedAt - openedAt,
      activeDuration: closedAt - openedAt - pausedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openedAt: 10, closedAt: 40, pausedDuration: 5 },
  output: { elapsed: 30, activeDuration: 25 },
} satisfies ToolExample<Input, Output>;
export const monitoringQueryCycleDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/monitoring-query-cycle-duration",
    title: "Monitoring Query Cycle Duration Tool",
    description:
      "Calculate monitoring query cycle duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openedAt: { type: "number" },
        closedAt: { type: "number" },
        pausedDuration: { type: "number", minimum: 0 },
      },
      required: ["openedAt", "closedAt", "pausedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDuration: { type: "number" },
      },
      required: ["elapsed", "activeDuration"],
    },
    ports: {
      inputs: [
        {
          id: "openedAt",
          label: "Opened At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closedAt",
          label: "Closed At",
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
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = monitoringQueryCycleDurationTool.execute;
export default monitoringQueryCycleDurationTool;
