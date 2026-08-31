import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  bounded,
  at,
} from "../shared.js";
export type Input = Readonly<{
  readonly conditionalSuccessProbabilityByPull: readonly number[];
  readonly alreadyFailedPullCount: number;
  readonly callerCostPerPull: number;
}>;
export type Output = Readonly<{
  readonly expectedAdditionalPulls: number;
  readonly expectedAdditionalCost: number;
  readonly maximumAdditionalPulls: number;
}>;
const inputFields = [
  {
    id: "conditionalSuccessProbabilityByPull",
    label: "Conditional success probability by pull",
    kind: "numberList",
  },
  {
    id: "alreadyFailedPullCount",
    label: "Already failed pull count",
    kind: "number",
  },
  { id: "callerCostPerPull", label: "Caller cost per pull", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerCostPerPull, "callerCostPerPull");
  input.conditionalSuccessProbabilityByPull.forEach((v) =>
    fraction(v, "conditionalSuccessProbabilityByPull"),
  );
  if (
    !input.conditionalSuccessProbabilityByPull.length ||
    input.conditionalSuccessProbabilityByPull.length > 1000 ||
    input.conditionalSuccessProbabilityByPull.at(-1) !== 1
  )
    simpleError(
      "pity",
      "Explicit bounded conditional schedule ending in certain success required.",
    );
  bounded(
    input.alreadyFailedPullCount,
    "failedPulls",
    0,
    input.conditionalSuccessProbabilityByPull.length - 1,
  );
  if (
    input.conditionalSuccessProbabilityByPull
      .slice(0, input.alreadyFailedPullCount)
      .some((p) => p === 1)
  )
    simpleError(
      "failedPulls",
      "Observed failure cannot follow an earlier certain-success pull in this schedule.",
    );
  let survival = 1,
    expected = 0;
  for (
    let i = input.alreadyFailedPullCount;
    i < input.conditionalSuccessProbabilityByPull.length;
    i++
  ) {
    expected += survival;
    survival *= 1 - input.conditionalSuccessProbabilityByPull[i];
  }
  return {
    expectedAdditionalPulls: expected,
    expectedAdditionalCost: expected * input.callerCostPerPull,
    maximumAdditionalPulls:
      input.conditionalSuccessProbabilityByPull.length -
      input.alreadyFailedPullCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  conditionalSuccessProbabilityByPull: [0.5, 1],
  alreadyFailedPullCount: 0,
  callerCostPerPull: 2,
} satisfies Input;
export const exampleOutput = {
  expectedAdditionalPulls: 1.5,
  expectedAdditionalCost: 3,
  maximumAdditionalPulls: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/gacha-pity-counter-expected-cost",
  title: "Gacha Pity Counter Expected Cost",
  description:
    "Compute remaining finite hard-pity acquisition expectation from caller conditional per-pull schedule and known failures, not fixed independent geometric chance; no banner/reset guarantee or monetary return claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedAdditionalPulls",
      label: "Expected additional pulls",
      kind: "number",
    },
    {
      id: "expectedAdditionalCost",
      label: "Expected additional cost",
      kind: "number",
    },
    {
      id: "maximumAdditionalPulls",
      label: "Maximum additional pulls",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      conditionalSuccessProbabilityByPull:
        value.conditionalSuccessProbabilityByPull as readonly number[],
      alreadyFailedPullCount: value.alreadyFailedPullCount as number,
      callerCostPerPull: value.callerCostPerPull as number,
    }),
});
export const run = tool.execute;
export default tool;
