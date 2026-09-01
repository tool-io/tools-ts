import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  aligned,
  binary,
  sumMoney,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly plannedWeekCostMinor: readonly number[];
  readonly alreadyIncurredWeekCostMinor: readonly number[];
  readonly weekEvidenceFlags: readonly number[];
  readonly preproductionCostMinor: number;
  readonly callerRunBudgetMinor: number;
}>;
export type Output = Readonly<{
  readonly totalPlannedRunCostMinor: number;
  readonly totalKnownIncurredCostMinor: number;
  readonly signedPlannedBudgetMarginMinor: number;
  readonly knownWeekPlannedMinusIncurredMarginsMinor: readonly number[];
  readonly unknownWeekMarginIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "plannedWeekCostMinor",
    label: "Planned week cost minor",
    kind: "numberList",
  },
  {
    id: "alreadyIncurredWeekCostMinor",
    label: "Already incurred week cost minor",
    kind: "numberList",
  },
  { id: "weekEvidenceFlags", label: "Week evidence flags", kind: "numberList" },
  {
    id: "preproductionCostMinor",
    label: "Preproduction cost minor",
    kind: "number",
  },
  {
    id: "callerRunBudgetMinor",
    label: "Caller run budget minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.plannedWeekCostMinor,
    input.alreadyIncurredWeekCostMinor,
    "weeks",
  );
  aligned(input.plannedWeekCostMinor, input.weekEvidenceFlags, "weeks");
  binary(input.weekEvidenceFlags, "evidence");
  [
    ...input.plannedWeekCostMinor,
    ...input.alreadyIncurredWeekCostMinor,
    input.preproductionCostMinor,
    input.callerRunBudgetMinor,
  ].forEach((v) => bounded(v, "cost", 0, 1000000000));
  const planned = sumMoney([
      input.preproductionCostMinor,
      ...input.plannedWeekCostMinor,
    ]),
    incurred = sumMoney([
      input.preproductionCostMinor,
      ...input.alreadyIncurredWeekCostMinor.filter(
        (_, i) => input.weekEvidenceFlags[i] === 1,
      ),
    ]);
  return {
    totalPlannedRunCostMinor: planned,
    totalKnownIncurredCostMinor: incurred,
    signedPlannedBudgetMarginMinor: integer(
      input.callerRunBudgetMinor - planned,
      "margin",
    ),
    knownWeekPlannedMinusIncurredMarginsMinor: input.plannedWeekCostMinor.map(
      (v, i) =>
        input.weekEvidenceFlags[i]
          ? v - input.alreadyIncurredWeekCostMinor[i]
          : -1,
    ),
    unknownWeekMarginIndices: input.weekEvidenceFlags.flatMap((v, i) =>
      v ? [] : [i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedWeekCostMinor: [1000, 1200],
  alreadyIncurredWeekCostMinor: [900, 0],
  weekEvidenceFlags: [1, 0],
  preproductionCostMinor: 500,
  callerRunBudgetMinor: 3000,
} satisfies Input;
export const exampleOutput = {
  totalPlannedRunCostMinor: 2700,
  totalKnownIncurredCostMinor: 1400,
  signedPlannedBudgetMarginMinor: 300,
  knownWeekPlannedMinusIncurredMarginsMinor: [100, -1],
  unknownWeekMarginIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/weekly-operating-budget-run-weeks-total-calculator",
  title: "Weekly Operating Budget Run Weeks Total Calculator",
  description:
    "Reconcile actual week-by-week plan/known incurred ledger plus fixed preproduction cost with explicit run budget; missing week margins unavailable −1 with separate unknown indices, not recoupment/profit or constant-week multiplication.",
  inputs: inputFields,
  outputs: [
    {
      id: "unknownWeekMarginIndices",
      label: "Unknown week margin indices",
      kind: "numberList",
    },
    {
      id: "totalPlannedRunCostMinor",
      label: "Total planned run cost minor",
      kind: "number",
    },
    {
      id: "totalKnownIncurredCostMinor",
      label: "Total known incurred cost minor",
      kind: "number",
    },
    {
      id: "signedPlannedBudgetMarginMinor",
      label: "Signed planned budget margin minor",
      kind: "number",
    },
    {
      id: "knownWeekPlannedMinusIncurredMarginsMinor",
      label: "Known week planned minus incurred margins minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      plannedWeekCostMinor: value.plannedWeekCostMinor as readonly number[],
      alreadyIncurredWeekCostMinor:
        value.alreadyIncurredWeekCostMinor as readonly number[],
      weekEvidenceFlags: value.weekEvidenceFlags as readonly number[],
      preproductionCostMinor: value.preproductionCostMinor as number,
      callerRunBudgetMinor: value.callerRunBudgetMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
