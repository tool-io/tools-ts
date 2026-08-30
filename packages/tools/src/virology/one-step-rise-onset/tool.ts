import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly titers: readonly number[];
  readonly baselineTiter: number;
  readonly minimumRiseFold: number;
}>;
export type Output = Readonly<{
  readonly firstRiseHour: number;
  readonly detected: boolean;
  readonly lastBelowRiseHour: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.observationHours, input.titers, "observationHours");
  ordered(input.observationHours, "observationHours");
  input.observationHours.forEach((v) => nonnegative(v, "observationHours"));
  input.titers.forEach((v) => nonnegative(v, "titers"));
  positive(input.baselineTiter, "baselineTiter");
  if (input.minimumRiseFold <= 1)
    simpleError("minimumRiseFold", "Rise fold must exceed one.");
  const index = input.titers.findIndex(
    (v) => v >= input.baselineTiter * input.minimumRiseFold,
  );
  return {
    firstRiseHour: index < 0 ? -1 : input.observationHours[index],
    detected: index >= 0,
    lastBelowRiseHour: index > 0 ? input.observationHours[index - 1] : -1,
  };
};
export const exampleInput = {
  observationHours: [0, 1, 2, 3],
  titers: [10, 10, 20, 50],
  baselineTiter: 10,
  minimumRiseFold: 2,
} satisfies Input;
export const exampleOutput = {
  firstRiseHour: 2,
  detected: true,
  lastBelowRiseHour: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/one-step-rise-onset",
  title: "One Step Rise Onset",
  description:
    "Locate the first sampled titer rise meeting a supplied fold threshold; resolution is bounded by sampling, not continuous onset inference.",
  inputs: [
    { id: "observationHours", label: "Observation hours", kind: "numberList" },
    { id: "titers", label: "Titers", kind: "numberList" },
    { id: "baselineTiter", label: "Baseline titer", kind: "number" },
    { id: "minimumRiseFold", label: "Minimum rise fold", kind: "number" },
  ],
  outputs: [
    { id: "firstRiseHour", label: "First rise hour", kind: "number" },
    { id: "detected", label: "Detected", kind: "boolean" },
    { id: "lastBelowRiseHour", label: "Last below rise hour", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      titers: value.titers as readonly number[],
      baselineTiter: value.baselineTiter as number,
      minimumRiseFold: value.minimumRiseFold as number,
    }),
});
export const run = tool.execute;
export default tool;
