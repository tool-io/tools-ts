import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly daysToDue: number;
  readonly remainingWorkDays: number;
};
export type Output = {
  readonly criticalRatio: number;
  readonly slackDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysToDue: { type: "number" },
    remainingWorkDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["daysToDue", "remainingWorkDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    criticalRatio: { type: "number" },
    slackDays: { type: "number" },
  },
  required: ["criticalRatio", "slackDays"],
} as const;
/** Calculate critical ratio remaining work days from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { daysToDue, remainingWorkDays } = request;
  const compute = (): Output => {
    H.positive(remainingWorkDays);
    return {
      criticalRatio: daysToDue / remainingWorkDays,
      slackDays: daysToDue - remainingWorkDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { daysToDue: 10, remainingWorkDays: 8 },
  output: { criticalRatio: 1.25, slackDays: 2 },
} satisfies ToolExample<Input, Output>;
export const criticalRatioRemainingWorkDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/critical-ratio-remaining-work-days",
    title: "Critical Ratio Remaining Work Days Tool",
    description:
      "Calculate critical ratio remaining work days from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysToDue: { type: "number" },
        remainingWorkDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["daysToDue", "remainingWorkDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        criticalRatio: { type: "number" },
        slackDays: { type: "number" },
      },
      required: ["criticalRatio", "slackDays"],
    },
    ports: {
      inputs: [
        {
          id: "daysToDue",
          label: "Days To Due",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingWorkDays",
          label: "Remaining Work Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "criticalRatio",
          label: "Critical Ratio",
          valueType: { type: "number" },
        },
        { id: "slackDays", label: "Slack Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = criticalRatioRemainingWorkDaysTool.execute;
export default criticalRatioRemainingWorkDaysTool;
