import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  weightedMinor,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerWrittenPremiumMinor: number;
  readonly callerObservedElapsedTermDays: number;
  readonly callerTotalTermDays: number;
  readonly callerMinimumEarnedBasisPoints: number;
  readonly callerNonrefundableFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly callerProRataEarnedMinor: number;
  readonly callerMinimumEarnedMinor: number;
  readonly callerModeledReturnPremiumMinor: number;
}>;
const inputFields = [
  {
    id: "callerWrittenPremiumMinor",
    label: "Caller written premium minor",
    kind: "number",
  },
  {
    id: "callerObservedElapsedTermDays",
    label: "Caller observed elapsed term days",
    kind: "number",
  },
  {
    id: "callerTotalTermDays",
    label: "Caller total term days",
    kind: "number",
  },
  {
    id: "callerMinimumEarnedBasisPoints",
    label: "Caller minimum earned basis points",
    kind: "number",
  },
  {
    id: "callerNonrefundableFeeMinor",
    label: "Caller nonrefundable fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerWrittenPremiumMinor);
  money(input.callerNonrefundableFeeMinor);
  bounded(input.callerTotalTermDays, "term", 1, 3660);
  bounded(
    input.callerObservedElapsedTermDays,
    "elapsed",
    0,
    input.callerTotalTermDays,
  );
  const prorata = weightedMinor(
      input.callerWrittenPremiumMinor,
      input.callerObservedElapsedTermDays,
      input.callerTotalTermDays,
    ),
    minimum = share(
      input.callerWrittenPremiumMinor,
      input.callerMinimumEarnedBasisPoints,
    );
  return {
    callerProRataEarnedMinor: prorata,
    callerMinimumEarnedMinor: minimum,
    callerModeledReturnPremiumMinor: Math.max(
      0,
      input.callerWrittenPremiumMinor -
        Math.max(prorata, minimum) -
        input.callerNonrefundableFeeMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWrittenPremiumMinor: 10000,
  callerObservedElapsedTermDays: 20,
  callerTotalTermDays: 100,
  callerMinimumEarnedBasisPoints: 3000,
  callerNonrefundableFeeMinor: 100,
} satisfies Input;
export const exampleOutput = {
  callerProRataEarnedMinor: 2000,
  callerMinimumEarnedMinor: 3000,
  callerModeledReturnPremiumMinor: 6900,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/minimum-earned-premium-cancellation-formula",
  title: "Minimum Earned Premium Cancellation Formula Calculator",
  description:
    "Budget actual cancellation return under explicit greater-of-pro-rata/minimum-earned premium and independent nonrefundable fee; not short-rate table or legal refund guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerProRataEarnedMinor",
      label: "Caller pro rata earned minor",
      kind: "number",
    },
    {
      id: "callerMinimumEarnedMinor",
      label: "Caller minimum earned minor",
      kind: "number",
    },
    {
      id: "callerModeledReturnPremiumMinor",
      label: "Caller modeled return premium minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWrittenPremiumMinor: value.callerWrittenPremiumMinor as number,
      callerObservedElapsedTermDays:
        value.callerObservedElapsedTermDays as number,
      callerTotalTermDays: value.callerTotalTermDays as number,
      callerMinimumEarnedBasisPoints:
        value.callerMinimumEarnedBasisPoints as number,
      callerNonrefundableFeeMinor: value.callerNonrefundableFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
