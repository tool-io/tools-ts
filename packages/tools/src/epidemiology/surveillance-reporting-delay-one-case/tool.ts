import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetSeconds: number;
  readonly reportedSeconds: number;
  readonly timezoneOffsetDifferenceSeconds: number;
};
export type Output = {
  readonly correctedDelaySeconds: number;
  readonly delayDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetSeconds: { type: "number" },
    reportedSeconds: { type: "number" },
    timezoneOffsetDifferenceSeconds: { type: "number" },
  },
  required: [
    "onsetSeconds",
    "reportedSeconds",
    "timezoneOffsetDifferenceSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDelaySeconds: { type: "number" },
    delayDays: { type: "number" },
  },
  required: ["correctedDelaySeconds", "delayDays"],
} as const;
/** Correct a pair of local-clock epoch-like timestamps by subtracting report-minus-onset UTC-offset difference; negative delays remain audit-visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetSeconds, reportedSeconds, timezoneOffsetDifferenceSeconds } =
    request;
  const compute = (): Output => {
    return {
      correctedDelaySeconds:
        reportedSeconds - onsetSeconds - timezoneOffsetDifferenceSeconds,
      delayDays:
        (reportedSeconds - onsetSeconds - timezoneOffsetDifferenceSeconds) /
        86400,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    onsetSeconds: 0,
    reportedSeconds: 172800,
    timezoneOffsetDifferenceSeconds: 0,
  },
  output: { correctedDelaySeconds: 172800, delayDays: 2 },
} satisfies ToolExample<Input, Output>;
export const surveillanceReportingDelayOneCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/surveillance-reporting-delay-one-case",
    title: "Surveillance Reporting Delay One Case Tool",
    description:
      "Correct a pair of local-clock epoch-like timestamps by subtracting report-minus-onset UTC-offset difference; negative delays remain audit-visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetSeconds: { type: "number" },
        reportedSeconds: { type: "number" },
        timezoneOffsetDifferenceSeconds: { type: "number" },
      },
      required: [
        "onsetSeconds",
        "reportedSeconds",
        "timezoneOffsetDifferenceSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedDelaySeconds: { type: "number" },
        delayDays: { type: "number" },
      },
      required: ["correctedDelaySeconds", "delayDays"],
    },
    ports: {
      inputs: [
        {
          id: "onsetSeconds",
          label: "Onset Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "reportedSeconds",
          label: "Reported Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "timezoneOffsetDifferenceSeconds",
          label: "Timezone Offset Difference Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "correctedDelaySeconds",
          label: "Corrected Delay Seconds",
          valueType: { type: "number", unit: "s" },
        },
        { id: "delayDays", label: "Delay Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surveillanceReportingDelayOneCaseTool.execute;
export default surveillanceReportingDelayOneCaseTool;
