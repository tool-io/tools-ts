import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, span } from "../shared.js";
export type Input = Readonly<{
  readonly loanStartMonthOrdinals: readonly number[];
  readonly observedOrPlannedReturnMonthOrdinals: readonly number[];
  readonly callerLoanMonthLimits: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLoanMonthSpans: readonly number[];
  readonly signedMonthLimitMargins: readonly number[];
  readonly aboveCallerDurationFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "loanStartMonthOrdinals",
    label: "Loan start month ordinals",
    kind: "numberList",
  },
  {
    id: "observedOrPlannedReturnMonthOrdinals",
    label: "Observed or planned return month ordinals",
    kind: "numberList",
  },
  {
    id: "callerLoanMonthLimits",
    label: "Caller loan month limits",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.loanStartMonthOrdinals.forEach((v) =>
    count(v, "loanStartMonthOrdinals"),
  );
  input.observedOrPlannedReturnMonthOrdinals.forEach((v) =>
    count(v, "observedOrPlannedReturnMonthOrdinals"),
  );
  input.callerLoanMonthLimits.forEach((v) => count(v, "callerLoanMonthLimits"));
  aligned(
    input.loanStartMonthOrdinals,
    input.observedOrPlannedReturnMonthOrdinals,
    "loanStartMonthOrdinals",
  );
  aligned(
    input.loanStartMonthOrdinals,
    input.callerLoanMonthLimits,
    "loanStartMonthOrdinals",
  );
  const d = input.loanStartMonthOrdinals.map((v, i) =>
    span(v, input.observedOrPlannedReturnMonthOrdinals[i], "loan"),
  );
  return {
    observedLoanMonthSpans: d,
    signedMonthLimitMargins: d.map(
      (v, i) => input.callerLoanMonthLimits[i] - v,
    ),
    aboveCallerDurationFlags: d.map((v, i) =>
      v > input.callerLoanMonthLimits[i] ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  loanStartMonthOrdinals: [100, 110],
  observedOrPlannedReturnMonthOrdinals: [112, 125],
  callerLoanMonthLimits: [12, 12],
} satisfies Input;
export const exampleOutput = {
  observedLoanMonthSpans: [12, 15],
  signedMonthLimitMargins: [0, -3],
  aboveCallerDurationFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/loan-out-months-limit-checker",
  title: "Loan Out Duration Months Standard Limit Checker",
  description:
    "Audit actual/planned loans in continuous whole-month ordinals against per-loan caller limits; partial-month convention must already be resolved, no standard lawful duration.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLoanMonthSpans",
      label: "Observed loan month spans",
      kind: "numberList",
    },
    {
      id: "signedMonthLimitMargins",
      label: "Signed month limit margins",
      kind: "numberList",
    },
    {
      id: "aboveCallerDurationFlags",
      label: "Above caller duration flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      loanStartMonthOrdinals: value.loanStartMonthOrdinals as readonly number[],
      observedOrPlannedReturnMonthOrdinals:
        value.observedOrPlannedReturnMonthOrdinals as readonly number[],
      callerLoanMonthLimits: value.callerLoanMonthLimits as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
