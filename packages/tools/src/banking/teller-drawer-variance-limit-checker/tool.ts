import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
  bounded,
  aligned,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly cashDenominationsMinor: readonly number[];
  readonly observedNoteCounts: readonly number[];
  readonly openingDrawerMinor: number;
  readonly recordedCashInMinor: readonly number[];
  readonly recordedCashOutMinor: readonly number[];
  readonly callerVarianceToleranceMinor: number;
}>;
export type Output = Readonly<{
  readonly observedDrawerMinor: number;
  readonly expectedDrawerMinor: number;
  readonly signedDrawerOverShortMinor: number;
  readonly withinCallerDrawerTolerance: boolean;
}>;
const inputFields = [
  {
    id: "cashDenominationsMinor",
    label: "Cash denominations minor",
    kind: "numberList",
  },
  {
    id: "observedNoteCounts",
    label: "Observed note counts",
    kind: "numberList",
  },
  { id: "openingDrawerMinor", label: "Opening drawer minor", kind: "number" },
  {
    id: "recordedCashInMinor",
    label: "Recorded cash in minor",
    kind: "numberList",
  },
  {
    id: "recordedCashOutMinor",
    label: "Recorded cash out minor",
    kind: "numberList",
  },
  {
    id: "callerVarianceToleranceMinor",
    label: "Caller variance tolerance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cashDenominationsMinor.forEach((v) =>
    money(v, "cashDenominationsMinor"),
  );
  money(input.openingDrawerMinor, "openingDrawerMinor");
  input.recordedCashInMinor.forEach((v) => money(v, "recordedCashInMinor"));
  input.recordedCashOutMinor.forEach((v) => money(v, "recordedCashOutMinor"));
  money(input.callerVarianceToleranceMinor, "callerVarianceToleranceMinor");
  aligned(
    input.cashDenominationsMinor,
    input.observedNoteCounts,
    "cashDenominationsMinor",
  );
  input.cashDenominationsMinor.forEach((v) => positive(v, "denomination"));
  input.observedNoteCounts.forEach((v) => bounded(v, "notes", 0, 1000000));
  const observed = sumMoney(
      input.cashDenominationsMinor.map((v, i) =>
        money(v * input.observedNoteCounts[i], "cash"),
      ),
    ),
    expected = signedSum([
      input.openingDrawerMinor,
      sumMoney(input.recordedCashInMinor),
      -sumMoney(input.recordedCashOutMinor),
    ]),
    gap = integer(observed - expected, "variance");
  return {
    observedDrawerMinor: observed,
    expectedDrawerMinor: expected,
    signedDrawerOverShortMinor: gap,
    withinCallerDrawerTolerance:
      Math.abs(gap) <= input.callerVarianceToleranceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cashDenominationsMinor: [100, 500],
  observedNoteCounts: [2, 3],
  openingDrawerMinor: 1000,
  recordedCashInMinor: [1000],
  recordedCashOutMinor: [200],
  callerVarianceToleranceMinor: 50,
} satisfies Input;
export const exampleOutput = {
  observedDrawerMinor: 1700,
  expectedDrawerMinor: 1800,
  signedDrawerOverShortMinor: -100,
  withinCallerDrawerTolerance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/teller-drawer-variance-limit-checker",
  title: "Teller Drawer Variance Limit Checker",
  description:
    "Reconcile actual denomination counts with drawer cash-in/out ledger and caller over/short tolerance, retaining signed deficit; no finding of theft, cash authenticity or complete audit assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDrawerMinor",
      label: "Observed drawer minor",
      kind: "number",
    },
    {
      id: "expectedDrawerMinor",
      label: "Expected drawer minor",
      kind: "number",
    },
    {
      id: "signedDrawerOverShortMinor",
      label: "Signed drawer over short minor",
      kind: "number",
    },
    {
      id: "withinCallerDrawerTolerance",
      label: "Within caller drawer tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      cashDenominationsMinor: value.cashDenominationsMinor as readonly number[],
      observedNoteCounts: value.observedNoteCounts as readonly number[],
      openingDrawerMinor: value.openingDrawerMinor as number,
      recordedCashInMinor: value.recordedCashInMinor as readonly number[],
      recordedCashOutMinor: value.recordedCashOutMinor as readonly number[],
      callerVarianceToleranceMinor:
        value.callerVarianceToleranceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
