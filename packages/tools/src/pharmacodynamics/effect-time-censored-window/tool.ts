import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly censorTime: number;
  readonly observed: boolean;
  readonly startTime: number;
};
export type Output = {
  readonly duration: number;
  readonly rightCensored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number" },
    censorTime: { type: "number" },
    observed: { type: "boolean" },
    startTime: { type: "number" },
  },
  required: ["observedTime", "censorTime", "observed", "startTime"],
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
/** Represent supplied research event or censor duration without estimating time to effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, censorTime, observed, startTime } = request;
  const compute = (): Output => {
    H.domain(
      censorTime >= startTime &&
        (!observed ||
          (observedTime >= startTime && observedTime <= censorTime)),
    );
    return {
      duration: (observed ? observedTime : censorTime) - startTime,
      rightCensored: !observed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 12, censorTime: 20, observed: true, startTime: 2 },
  output: { duration: 10, rightCensored: false },
} satisfies ToolExample<Input, Output>;
export const effectTimeCensoredWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/effect-time-censored-window",
    title: "Effect Time Censored Window Tool",
    description:
      "Represent supplied research event or censor duration without estimating time to effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number" },
        censorTime: { type: "number" },
        observed: { type: "boolean" },
        startTime: { type: "number" },
      },
      required: ["observedTime", "censorTime", "observed", "startTime"],
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
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "censorTime",
          label: "Censor Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "startTime",
          label: "Start Time",
          required: true,
          valueType: { type: "number" },
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
export const run = effectTimeCensoredWindowTool.execute;
export default effectTimeCensoredWindowTool;
