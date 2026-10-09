import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly pausedDays: number;
  readonly suppliedLimitDays: number;
};
export type Output = {
  readonly activeDays: number;
  readonly remainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "number", minimum: 0 },
    pausedDays: { type: "number", minimum: 0 },
    suppliedLimitDays: { type: "number", minimum: 0 },
  },
  required: ["elapsedDays", "pausedDays", "suppliedLimitDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeDays: { type: "number" },
    remainingDays: { type: "number" },
  },
  required: ["activeDays", "remainingDays"],
} as const;
/** Subtract explicitly counted paused days from a supplied appeal clock without selecting legal deadlines or calendar rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, pausedDays, suppliedLimitDays } = request;
  const compute = (): Output => {
    H.domain(
      elapsedDays >= 0 &&
        pausedDays >= 0 &&
        pausedDays <= elapsedDays &&
        suppliedLimitDays >= 0,
      "elapsedDays",
    );
    return {
      activeDays: elapsedDays - pausedDays,
      remainingDays: suppliedLimitDays - elapsedDays + pausedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedDays: 20, pausedDays: 5, suppliedLimitDays: 30 },
  output: { activeDays: 15, remainingDays: 15 },
} satisfies ToolExample<Input, Output>;
export const healthPolicyAppealClockPauseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/health-policy-appeal-clock-pause",
    title: "Health Policy Appeal Clock Pause",
    description:
      "Subtract explicitly counted paused days from a supplied appeal clock without selecting legal deadlines or calendar rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "number", minimum: 0 },
        pausedDays: { type: "number", minimum: 0 },
        suppliedLimitDays: { type: "number", minimum: 0 },
      },
      required: ["elapsedDays", "pausedDays", "suppliedLimitDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeDays: { type: "number" },
        remainingDays: { type: "number" },
      },
      required: ["activeDays", "remainingDays"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedDays",
          label: "Paused Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimitDays",
          label: "Supplied Limit Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeDays",
          label: "Active Days",
          valueType: { type: "number" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthPolicyAppealClockPauseTool.execute;
export default healthPolicyAppealClockPauseTool;
