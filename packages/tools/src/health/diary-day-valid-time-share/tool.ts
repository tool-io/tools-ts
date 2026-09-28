import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly validMinutes: number;
  readonly observedMinutes: number;
  readonly excludedObservedMinutes: number;
};
export type Output = {
  readonly denominatorMinutes: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number", minimum: 0 },
    excludedObservedMinutes: { type: "number", minimum: 0 },
  },
  required: ["validMinutes", "observedMinutes", "excludedObservedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorMinutes: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominatorMinutes", "share", "defined"],
} as const;
/** Audit caller-classified diary observation coverage without health or behavioral interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validMinutes, observedMinutes, excludedObservedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      observedMinutes >= 0 &&
        excludedObservedMinutes >= 0 &&
        excludedObservedMinutes <= observedMinutes &&
        validMinutes >= 0 &&
        validMinutes <= observedMinutes - excludedObservedMinutes,
    );
    return {
      denominatorMinutes: observedMinutes - excludedObservedMinutes,
      share:
        observedMinutes > excludedObservedMinutes
          ? validMinutes / (observedMinutes - excludedObservedMinutes)
          : 0,
      defined: observedMinutes > excludedObservedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    validMinutes: 60,
    observedMinutes: 100,
    excludedObservedMinutes: 20,
  },
  output: { denominatorMinutes: 80, share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const diaryDayValidTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/diary-day-valid-time-share",
    title: "Diary Day Valid Time Share Tool",
    description:
      "Audit caller-classified diary observation coverage without health or behavioral interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validMinutes: { type: "number", minimum: 0 },
        observedMinutes: { type: "number", minimum: 0 },
        excludedObservedMinutes: { type: "number", minimum: 0 },
      },
      required: ["validMinutes", "observedMinutes", "excludedObservedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorMinutes: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominatorMinutes", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "validMinutes",
          label: "Valid Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedObservedMinutes",
          label: "Excluded Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "denominatorMinutes",
          label: "Denominator Minutes",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diaryDayValidTimeShareTool.execute;
export default diaryDayValidTimeShareTool;
