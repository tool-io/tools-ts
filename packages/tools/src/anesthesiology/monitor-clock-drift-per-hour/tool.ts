import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedOffset: number;
  readonly elapsedHours: number;
};
export type Output = { readonly driftPerHour: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedOffset: { type: "number" },
    elapsedHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedOffset", "elapsedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { driftPerHour: { type: "number" } },
  required: ["driftPerHour"],
} as const;
/** Estimate a supplied monitor-clock offset per elapsed hour without clinical monitor validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedOffset, elapsedHours } = request;
  const compute = (): Output => {
    H.positive(elapsedHours);
    return { driftPerHour: observedOffset / elapsedHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedOffset: 3, elapsedHours: 2 },
  output: { driftPerHour: 1.5 },
} satisfies ToolExample<Input, Output>;
export const monitorClockDriftPerHourTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/monitor-clock-drift-per-hour",
    title: "Monitor Clock Drift Per Hour Tool",
    description:
      "Estimate a supplied monitor-clock offset per elapsed hour without clinical monitor validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedOffset: { type: "number" },
        elapsedHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedOffset", "elapsedHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { driftPerHour: { type: "number" } },
      required: ["driftPerHour"],
    },
    ports: {
      inputs: [
        {
          id: "observedOffset",
          label: "Observed Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "driftPerHour",
          label: "Drift Per Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = monitorClockDriftPerHourTool.execute;
export default monitorClockDriftPerHourTool;
