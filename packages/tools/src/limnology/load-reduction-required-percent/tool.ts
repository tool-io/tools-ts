import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedSourceLoadsKgYear: readonly number[];
  readonly callerTotalLoadTargetKgYear: number;
  readonly callerSourceReducibleFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalObservedLoadKgYear: number;
  readonly positiveLoadReductionRequiredKgYear: number;
  readonly requiredTotalLoadReductionPercent: number;
  readonly maximumCallerFeasibleReductionKgYear: number;
  readonly targetFeasibleUnderCallerReducibility: boolean;
}>;
const inputFields = [
  {
    id: "observedSourceLoadsKgYear",
    label: "Observed source loads kg year",
    kind: "numberList",
  },
  {
    id: "callerTotalLoadTargetKgYear",
    label: "Caller total load target kg year",
    kind: "number",
  },
  {
    id: "callerSourceReducibleFractions",
    label: "Caller source reducible fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSourceLoadsKgYear.forEach((v) =>
    nonnegative(v, "observedSourceLoadsKgYear"),
  );
  nonnegative(input.callerTotalLoadTargetKgYear, "callerTotalLoadTargetKgYear");
  input.callerSourceReducibleFractions.forEach((v) =>
    fraction(v, "callerSourceReducibleFractions"),
  );
  aligned(
    input.observedSourceLoadsKgYear,
    input.callerSourceReducibleFractions,
    "observedSourceLoadsKgYear",
  );
  const total = positive(sum(input.observedSourceLoadsKgYear), "load"),
    required = Math.max(0, total - input.callerTotalLoadTargetKgYear),
    possible = sum(
      input.observedSourceLoadsKgYear.map(
        (v, i) => v * input.callerSourceReducibleFractions[i],
      ),
    );
  return {
    totalObservedLoadKgYear: total,
    positiveLoadReductionRequiredKgYear: required,
    requiredTotalLoadReductionPercent: 100 * (required / total),
    maximumCallerFeasibleReductionKgYear: possible,
    targetFeasibleUnderCallerReducibility: required <= possible,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSourceLoadsKgYear: [40, 60],
  callerTotalLoadTargetKgYear: 50,
  callerSourceReducibleFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  totalObservedLoadKgYear: 100,
  positiveLoadReductionRequiredKgYear: 50,
  requiredTotalLoadReductionPercent: 50,
  maximumCallerFeasibleReductionKgYear: 70,
  targetFeasibleUnderCallerReducibility: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/load-reduction-required-percent",
  title: "Load Reduction Required Percent Calculator",
  description:
    "Audit observed load-source ledger against caller total target and independently reducible fractions; not regulatory reduction mandate or guarantee of concentration/ecological response.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedLoadKgYear",
      label: "Total observed load kg year",
      kind: "number",
    },
    {
      id: "positiveLoadReductionRequiredKgYear",
      label: "Positive load reduction required kg year",
      kind: "number",
    },
    {
      id: "requiredTotalLoadReductionPercent",
      label: "Required total load reduction percent",
      kind: "number",
    },
    {
      id: "maximumCallerFeasibleReductionKgYear",
      label: "Maximum caller feasible reduction kg year",
      kind: "number",
    },
    {
      id: "targetFeasibleUnderCallerReducibility",
      label: "Target feasible under caller reducibility",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSourceLoadsKgYear:
        value.observedSourceLoadsKgYear as readonly number[],
      callerTotalLoadTargetKgYear: value.callerTotalLoadTargetKgYear as number,
      callerSourceReducibleFractions:
        value.callerSourceReducibleFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
