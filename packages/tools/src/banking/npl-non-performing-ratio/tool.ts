import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedLoanBalancesMinor: readonly number[];
  readonly performingZeroNonperformingOneUnknownTwoCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNonperformingBalanceMinor: number;
  readonly unknownClassificationBalanceMinor: number;
  readonly knownClassificationNplPercent: number;
  readonly knownNplShareOfAllObservedLoansPercent: number;
  readonly knownClassificationEvidenceAvailable: boolean;
}>;
const inputFields = [
  {
    id: "observedLoanBalancesMinor",
    label: "Observed loan balances minor",
    kind: "numberList",
  },
  {
    id: "performingZeroNonperformingOneUnknownTwoCodes",
    label: "Performing zero nonperforming one unknown two codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLoanBalancesMinor.forEach((v) =>
    money(v, "observedLoanBalancesMinor"),
  );
  aligned(
    input.observedLoanBalancesMinor,
    input.performingZeroNonperformingOneUnknownTwoCodes,
    "observedLoanBalancesMinor",
  );
  input.performingZeroNonperformingOneUnknownTwoCodes.forEach((v) =>
    bounded(v, "classification", 0, 2),
  );
  const total = positive(
      sumMoney(input.observedLoanBalancesMinor),
      "loanBalance",
    ),
    np = sumMoney(
      input.observedLoanBalancesMinor.filter(
        (_, i) => input.performingZeroNonperformingOneUnknownTwoCodes[i] === 1,
      ),
    ),
    unknown = sumMoney(
      input.observedLoanBalancesMinor.filter(
        (_, i) => input.performingZeroNonperformingOneUnknownTwoCodes[i] === 2,
      ),
    ),
    known = total - unknown;
  return {
    observedNonperformingBalanceMinor: np,
    unknownClassificationBalanceMinor: unknown,
    knownClassificationNplPercent: known ? (100 * np) / known : -1,
    knownNplShareOfAllObservedLoansPercent: (100 * np) / total,
    knownClassificationEvidenceAvailable: known > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoanBalancesMinor: [100, 200, 300],
  performingZeroNonperformingOneUnknownTwoCodes: [1, 0, 2],
} satisfies Input;
export const exampleOutput = {
  observedNonperformingBalanceMinor: 100,
  unknownClassificationBalanceMinor: 300,
  knownClassificationNplPercent: 33.333333333333336,
  knownNplShareOfAllObservedLoansPercent: 16.666666666666668,
  knownClassificationEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/npl-non-performing-ratio",
  title: "NPL Non Performing Ratio Calculator",
  description:
    "Audit actual loan-ledger performing/nonperforming/unknown classifications with conditional known-only and all-observed denominators; unknown loans are not silently treated as performing and no delinquency/default classification rule is invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNonperformingBalanceMinor",
      label: "Observed nonperforming balance minor",
      kind: "number",
    },
    {
      id: "unknownClassificationBalanceMinor",
      label: "Unknown classification balance minor",
      kind: "number",
    },
    {
      id: "knownClassificationNplPercent",
      label: "Known classification npl percent",
      kind: "number",
    },
    {
      id: "knownNplShareOfAllObservedLoansPercent",
      label: "Known npl share of all observed loans percent",
      kind: "number",
    },
    {
      id: "knownClassificationEvidenceAvailable",
      label: "Known classification evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoanBalancesMinor:
        value.observedLoanBalancesMinor as readonly number[],
      performingZeroNonperformingOneUnknownTwoCodes:
        value.performingZeroNonperformingOneUnknownTwoCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
