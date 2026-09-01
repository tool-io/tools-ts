import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAnnualOopMaximumMinor: number;
  readonly observedCostSharePaymentsMinor: readonly number[];
  readonly callerOopCountedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedOopCountedMinor: number;
  readonly observedOopExcludedMinor: number;
  readonly remainingCallerOopMaximumMinor: number;
}>;
const inputFields = [
  {
    id: "callerAnnualOopMaximumMinor",
    label: "Caller annual oop maximum minor",
    kind: "number",
  },
  {
    id: "observedCostSharePaymentsMinor",
    label: "Observed cost share payments minor",
    kind: "numberList",
  },
  {
    id: "callerOopCountedFlags",
    label: "Caller oop counted flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCostSharePaymentsMinor,
    input.callerOopCountedFlags,
    "payments",
  );
  binary(input.callerOopCountedFlags, "counted");
  money(input.callerAnnualOopMaximumMinor);
  input.observedCostSharePaymentsMinor.forEach((v) => money(v));
  const counted = sumMoney(
    input.observedCostSharePaymentsMinor.filter(
      (_, i) => input.callerOopCountedFlags[i],
    ),
  );
  return {
    observedOopCountedMinor: counted,
    observedOopExcludedMinor: sumMoney(
      input.observedCostSharePaymentsMinor.filter(
        (_, i) => !input.callerOopCountedFlags[i],
      ),
    ),
    remainingCallerOopMaximumMinor: Math.max(
      0,
      input.callerAnnualOopMaximumMinor - counted,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnualOopMaximumMinor: 10000,
  observedCostSharePaymentsMinor: [2000, 3000, 4000],
  callerOopCountedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  observedOopCountedMinor: 6000,
  observedOopExcludedMinor: 3000,
  remainingCallerOopMaximumMinor: 4000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/oop-max-out-of-pocket-remaining-tracker",
  title: "OOP Max Out Of Pocket Remaining Tracker",
  description:
    "Audit actual cost-share ledger with independent plan OOP-counted flags and annual maximum, retaining excluded payments; no provider billing adjudication or absent-as-counted assumptions.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOopCountedMinor",
      label: "Observed oop counted minor",
      kind: "number",
    },
    {
      id: "observedOopExcludedMinor",
      label: "Observed oop excluded minor",
      kind: "number",
    },
    {
      id: "remainingCallerOopMaximumMinor",
      label: "Remaining caller oop maximum minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnualOopMaximumMinor: value.callerAnnualOopMaximumMinor as number,
      observedCostSharePaymentsMinor:
        value.observedCostSharePaymentsMinor as readonly number[],
      callerOopCountedFlags: value.callerOopCountedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
