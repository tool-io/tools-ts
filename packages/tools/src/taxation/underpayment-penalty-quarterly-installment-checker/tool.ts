import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sequence, money } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerRequiredCumulativeInstallmentsMinor: readonly number[];
  readonly observedCumulativeTimelyPaymentsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedCumulativeInstallmentGapsMinor: readonly number[];
  readonly shortQuarterIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerRequiredCumulativeInstallmentsMinor",
    label: "Caller required cumulative installments minor",
    kind: "numberList",
  },
  {
    id: "observedCumulativeTimelyPaymentsMinor",
    label: "Observed cumulative timely payments minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRequiredCumulativeInstallmentsMinor.forEach((v) =>
    money(v, "callerRequiredCumulativeInstallmentsMinor"),
  );
  input.observedCumulativeTimelyPaymentsMinor.forEach((v) =>
    money(v, "observedCumulativeTimelyPaymentsMinor"),
  );
  if (
    input.callerRequiredCumulativeInstallmentsMinor.length !== 4 ||
    input.observedCumulativeTimelyPaymentsMinor.length !== 4
  )
    simpleError(
      "quarters",
      "Four independently timing-qualified cumulative quarter values.",
    );
  sequence(
    input.callerRequiredCumulativeInstallmentsMinor,
    "required cumulative",
  );
  sequence(input.observedCumulativeTimelyPaymentsMinor, "payments cumulative");
  const d = input.callerRequiredCumulativeInstallmentsMinor.map(
    (v, i) => v - input.observedCumulativeTimelyPaymentsMinor[i],
  );
  return {
    signedCumulativeInstallmentGapsMinor: d,
    shortQuarterIndices: d.flatMap((v, i) => (v > 0 ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRequiredCumulativeInstallmentsMinor: [25, 50, 75, 100],
  observedCumulativeTimelyPaymentsMinor: [20, 55, 65, 110],
} satisfies Input;
export const exampleOutput = {
  signedCumulativeInstallmentGapsMinor: [5, -5, 10, -10],
  shortQuarterIndices: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/underpayment-penalty-quarterly-installment-checker",
  title: "Underpayment Penalty Quarterly Installment Checker",
  description:
    "Actual timely cumulative quarterly payment deficits/overages vs independently required installments, unlike annual safe-harbor screen; no interest penalty without dates/rates. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCumulativeInstallmentGapsMinor",
      label: "Signed cumulative installment gaps minor",
      kind: "numberList",
    },
    {
      id: "shortQuarterIndices",
      label: "Short quarter indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRequiredCumulativeInstallmentsMinor:
        value.callerRequiredCumulativeInstallmentsMinor as readonly number[],
      observedCumulativeTimelyPaymentsMinor:
        value.observedCumulativeTimelyPaymentsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
