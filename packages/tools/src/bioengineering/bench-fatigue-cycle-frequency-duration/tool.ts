import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly durationSeconds: number;
  readonly initialCycles: number;
};
export type Output = {
  readonly additionalCycles: number;
  readonly totalCycles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", minimum: 0 },
    durationSeconds: { type: "number", minimum: 0 },
    initialCycles: { type: "integer", minimum: 0 },
  },
  required: ["frequencyHz", "durationSeconds", "initialCycles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    additionalCycles: { type: "number" },
    totalCycles: { type: "number" },
  },
  required: ["additionalCycles", "totalCycles"],
} as const;
/** Cycle exposure arithmetic, without a fatigue-life or device-safety prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, durationSeconds, initialCycles } = request;
  const compute = (): Output => {
    H.domain(frequencyHz >= 0 && durationSeconds >= 0);
    H.integer(initialCycles, 0);
    return {
      additionalCycles: frequencyHz * durationSeconds,
      totalCycles: initialCycles + frequencyHz * durationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 2, durationSeconds: 1000, initialCycles: 100 },
  output: { additionalCycles: 2000, totalCycles: 2100 },
} satisfies ToolExample<Input, Output>;
export const benchFatigueCycleFrequencyDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bench-fatigue-cycle-frequency-duration",
    title: "Bench Fatigue Cycle Frequency Duration Tool",
    description:
      "Cycle exposure arithmetic, without a fatigue-life or device-safety prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", minimum: 0 },
        durationSeconds: { type: "number", minimum: 0 },
        initialCycles: { type: "integer", minimum: 0 },
      },
      required: ["frequencyHz", "durationSeconds", "initialCycles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        additionalCycles: { type: "number" },
        totalCycles: { type: "number" },
      },
      required: ["additionalCycles", "totalCycles"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "initialCycles",
          label: "Initial Cycles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "additionalCycles",
          label: "Additional Cycles",
          valueType: { type: "number" },
        },
        {
          id: "totalCycles",
          label: "Total Cycles",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benchFatigueCycleFrequencyDurationTool.execute;
export default benchFatigueCycleFrequencyDurationTool;
