import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedWonCases: number;
  readonly observedLostCases: number;
  readonly observedPendingCases: number;
}>;
export type Output = Readonly<{
  readonly decidedRepresentmentWinRatePercent: number;
  readonly allObservedCaseCount: number;
  readonly pendingCaseSharePercent: number;
  readonly decidedEvidenceAvailable: boolean;
}>;
const inputFields = [
  { id: "observedWonCases", label: "Observed won cases", kind: "number" },
  { id: "observedLostCases", label: "Observed lost cases", kind: "number" },
  {
    id: "observedPendingCases",
    label: "Observed pending cases",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedWonCases, "observedWonCases");
  money(input.observedLostCases, "observedLostCases");
  money(input.observedPendingCases, "observedPendingCases");
  const decided = sumMoney([input.observedWonCases, input.observedLostCases]),
    total = sumMoney([decided, input.observedPendingCases]);
  positive(total, "cases");
  return {
    decidedRepresentmentWinRatePercent: decided
      ? (100 * input.observedWonCases) / decided
      : -1,
    allObservedCaseCount: total,
    pendingCaseSharePercent: (100 * input.observedPendingCases) / total,
    decidedEvidenceAvailable: decided > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWonCases: 3,
  observedLostCases: 1,
  observedPendingCases: 6,
} satisfies Input;
export const exampleOutput = {
  decidedRepresentmentWinRatePercent: 75,
  allObservedCaseCount: 10,
  pendingCaseSharePercent: 60,
  decidedEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/chargeback-representment-win-rate-percent",
  title: "Chargeback Representment Win Rate Percent Calculator",
  description:
    "Audit actual decided chargeback representment outcomes separately from pending cases, retaining absent-decision evidence; denominator is won+lost, not all submissions and not a prediction of future recovery.",
  inputs: inputFields,
  outputs: [
    {
      id: "decidedRepresentmentWinRatePercent",
      label: "Decided representment win rate percent",
      kind: "number",
    },
    {
      id: "allObservedCaseCount",
      label: "All observed case count",
      kind: "number",
    },
    {
      id: "pendingCaseSharePercent",
      label: "Pending case share percent",
      kind: "number",
    },
    {
      id: "decidedEvidenceAvailable",
      label: "Decided evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWonCases: value.observedWonCases as number,
      observedLostCases: value.observedLostCases as number,
      observedPendingCases: value.observedPendingCases as number,
    }),
});
export const run = tool.execute;
export default tool;
