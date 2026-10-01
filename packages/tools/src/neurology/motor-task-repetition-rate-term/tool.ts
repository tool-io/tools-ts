import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repetitions: number;
  readonly elapsedSeconds: number;
  readonly excludedSeconds: number;
};
export type Output = {
  readonly activeSeconds: number;
  readonly repetitionsPerMinute: number;
  readonly secondsPerRepetition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repetitions: { type: "integer", minimum: 1 },
    elapsedSeconds: { type: "number" },
    excludedSeconds: { type: "number", minimum: 0 },
  },
  required: ["repetitions", "elapsedSeconds", "excludedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeSeconds: { type: "number" },
    repetitionsPerMinute: { type: "number" },
    secondsPerRepetition: { type: "number" },
  },
  required: ["activeSeconds", "repetitionsPerMinute", "secondsPerRepetition"],
} as const;
/** Observed task repetition cadence after explicit excluded time, without a neurological performance threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repetitions, elapsedSeconds, excludedSeconds } = request;
  const compute = (): Output => {
    H.integer(repetitions, 1);
    H.domain(excludedSeconds >= 0 && elapsedSeconds > excludedSeconds);
    return {
      activeSeconds: elapsedSeconds - excludedSeconds,
      repetitionsPerMinute:
        (60 * repetitions) / (elapsedSeconds - excludedSeconds),
      secondsPerRepetition: (elapsedSeconds - excludedSeconds) / repetitions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repetitions: 30, elapsedSeconds: 70, excludedSeconds: 10 },
  output: {
    activeSeconds: 60,
    repetitionsPerMinute: 30,
    secondsPerRepetition: 2,
  },
} satisfies ToolExample<Input, Output>;
export const motorTaskRepetitionRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/motor-task-repetition-rate-term",
    title: "Motor Task Repetition Rate Term Tool",
    description:
      "Observed task repetition cadence after explicit excluded time, without a neurological performance threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repetitions: { type: "integer", minimum: 1 },
        elapsedSeconds: { type: "number" },
        excludedSeconds: { type: "number", minimum: 0 },
      },
      required: ["repetitions", "elapsedSeconds", "excludedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeSeconds: { type: "number" },
        repetitionsPerMinute: { type: "number" },
        secondsPerRepetition: { type: "number" },
      },
      required: [
        "activeSeconds",
        "repetitionsPerMinute",
        "secondsPerRepetition",
      ],
    },
    ports: {
      inputs: [
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "excludedSeconds",
          label: "Excluded Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "activeSeconds",
          label: "Active Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "repetitionsPerMinute",
          label: "Repetitions Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "secondsPerRepetition",
          label: "Seconds Per Repetition",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = motorTaskRepetitionRateTermTool.execute;
export default motorTaskRepetitionRateTermTool;
