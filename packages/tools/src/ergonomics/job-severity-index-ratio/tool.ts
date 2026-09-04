import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedRepetitionCounts: readonly number[];
  readonly observedRecoverySeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRepetitionPerRecoverySecond: number;
}>;
const inputFields = [
  {
    id: "observedRepetitionCounts",
    label: "Observed repetition counts",
    kind: "numberList",
  },
  {
    id: "observedRecoverySeconds",
    label: "Observed recovery seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRecoverySeconds.forEach((v) =>
    positive(v, "observedRecoverySeconds"),
  );
  input.observedRepetitionCounts.forEach((v) =>
    nonnegative(v, "observedRepetitionCounts"),
  );
  aligned(
    input.observedRepetitionCounts,
    input.observedRecoverySeconds,
    "observedRepetitionCounts",
  );
  input.observedRepetitionCounts.forEach((v) => integer(v, "count"));
  return {
    observedRepetitionPerRecoverySecond:
      sum(input.observedRepetitionCounts) / sum(input.observedRecoverySeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRepetitionCounts: [10, 20],
  observedRecoverySeconds: [5, 10],
} satisfies Input;
export const exampleOutput = {
  observedRepetitionPerRecoverySecond: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/job-severity-index-ratio",
  title: "Job Severity Index Repetition-Rest Ratio Calculator",
  description:
    "Operational job-severity repetition/rest ratio from actual episode counts/recovery, not OCRA technical-actions/active-time frequency or injury likelihood. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRepetitionPerRecoverySecond",
      label: "Observed repetition per recovery second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRepetitionCounts:
        value.observedRepetitionCounts as readonly number[],
      observedRecoverySeconds:
        value.observedRecoverySeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
