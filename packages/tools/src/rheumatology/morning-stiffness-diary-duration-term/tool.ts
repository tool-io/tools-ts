import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wakeMinute: number;
  readonly onsetMinute: number;
  readonly endMinute: number;
  readonly censored: boolean;
};
export type Output = {
  readonly observedMinutes: number;
  readonly wakeDelayMinutes: number;
  readonly exact: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wakeMinute: { type: "number" },
    onsetMinute: { type: "number" },
    endMinute: { type: "number" },
    censored: { type: "boolean" },
  },
  required: ["wakeMinute", "onsetMinute", "endMinute", "censored"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMinutes: { type: "number" },
    wakeDelayMinutes: { type: "number" },
    exact: { type: "boolean" },
  },
  required: ["observedMinutes", "wakeDelayMinutes", "exact"],
} as const;
/** Compute supplied diary episode duration and wake delay with an explicit censor flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wakeMinute, onsetMinute, endMinute, censored } = request;
  const compute = (): Output => {
    H.domain(
      onsetMinute >= wakeMinute && endMinute >= onsetMinute,
      "onsetMinute",
    );
    return {
      observedMinutes: endMinute - onsetMinute,
      wakeDelayMinutes: onsetMinute - wakeMinute,
      exact: !censored,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wakeMinute: 360, onsetMinute: 370, endMinute: 410, censored: false },
  output: { observedMinutes: 40, wakeDelayMinutes: 10, exact: true },
} satisfies ToolExample<Input, Output>;
export const morningStiffnessDiaryDurationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/morning-stiffness-diary-duration-term",
    title: "Morning Stiffness Diary Duration Term Tool",
    description:
      "Compute supplied diary episode duration and wake delay with an explicit censor flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wakeMinute: { type: "number" },
        onsetMinute: { type: "number" },
        endMinute: { type: "number" },
        censored: { type: "boolean" },
      },
      required: ["wakeMinute", "onsetMinute", "endMinute", "censored"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMinutes: { type: "number" },
        wakeDelayMinutes: { type: "number" },
        exact: { type: "boolean" },
      },
      required: ["observedMinutes", "wakeDelayMinutes", "exact"],
    },
    ports: {
      inputs: [
        {
          id: "wakeMinute",
          label: "Wake Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onsetMinute",
          label: "Onset Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMinute",
          label: "End Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "censored",
          label: "Censored",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          valueType: { type: "number" },
        },
        {
          id: "wakeDelayMinutes",
          label: "Wake Delay Minutes",
          valueType: { type: "number" },
        },
        { id: "exact", label: "Exact", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = morningStiffnessDiaryDurationTermTool.execute;
export default morningStiffnessDiaryDurationTermTool;
