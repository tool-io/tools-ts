import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly observationEnd: number;
  readonly eventEnd: number;
  readonly ended: boolean;
};
export type Output = {
  readonly duration: number;
  readonly rightCensored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    observationEnd: { type: "number" },
    eventEnd: { type: "number" },
    ended: { type: "boolean" },
  },
  required: ["start", "observationEnd", "eventEnd", "ended"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number" },
    rightCensored: { type: "boolean" },
  },
  required: ["duration", "rightCensored"],
} as const;
/** Duration/right-censoring metadata for supplied research diary times, without symptom interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, observationEnd, eventEnd, ended } = request;
  const compute = (): Output => {
    H.domain(
      observationEnd >= start &&
        (!ended || (eventEnd >= start && eventEnd <= observationEnd)),
    );
    return {
      duration: (ended ? eventEnd : observationEnd) - start,
      rightCensored: !ended,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, observationEnd: 30, eventEnd: 20, ended: true },
  output: { duration: 10, rightCensored: false },
} satisfies ToolExample<Input, Output>;
export const giDiaryCensoredDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/gi-diary-censored-duration",
    title: "Gi Diary Censored Duration Tool",
    description:
      "Duration/right-censoring metadata for supplied research diary times, without symptom interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        observationEnd: { type: "number" },
        eventEnd: { type: "number" },
        ended: { type: "boolean" },
      },
      required: ["start", "observationEnd", "eventEnd", "ended"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number" },
        rightCensored: { type: "boolean" },
      },
      required: ["duration", "rightCensored"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationEnd",
          label: "Observation End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventEnd",
          label: "Event End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ended",
          label: "Ended",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "duration", label: "Duration", valueType: { type: "number" } },
        {
          id: "rightCensored",
          label: "Right Censored",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = giDiaryCensoredDurationTool.execute;
export default giDiaryCensoredDurationTool;
