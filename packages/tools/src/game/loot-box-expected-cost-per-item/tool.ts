import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
  at,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetItemProbabilities: readonly number[];
  readonly alreadyOwnedFlags: readonly number[];
  readonly callerCostPerBox: number;
}>;
export type Output = Readonly<{
  readonly unownedTargetItemCount: number;
  readonly expectedBoxesToCompleteTargets: number;
  readonly expectedAdditionalCollectionCost: number;
}>;
const inputFields = [
  {
    id: "targetItemProbabilities",
    label: "Target item probabilities",
    kind: "numberList",
  },
  { id: "alreadyOwnedFlags", label: "Already owned flags", kind: "numberList" },
  { id: "callerCostPerBox", label: "Caller cost per box", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerCostPerBox, "callerCostPerBox");
  input.targetItemProbabilities.forEach((v) =>
    fraction(v, "targetItemProbabilities"),
  );
  aligned(
    input.targetItemProbabilities,
    input.alreadyOwnedFlags,
    "targetItemProbabilities",
  );
  binary(input.alreadyOwnedFlags, "owned");
  if (
    input.targetItemProbabilities.length > 12 ||
    sum(input.targetItemProbabilities) > 1 ||
    input.targetItemProbabilities.some((v) => v <= 0)
  )
    simpleError(
      "probabilities",
      "At most twelve positive mutually exclusive per-box target probabilities summing to at most one required.",
    );
  const p = input.targetItemProbabilities.filter(
    (_, i) => input.alreadyOwnedFlags[i] === 0,
  );
  // Expected waiting time for each still-missing subset. The recurrence has
  // only nonnegative terms, avoiding cancellation for unequal probabilities.
  const expectations = Array<number>(2 ** p.length).fill(0);
  for (let mask = 1; mask < 2 ** p.length; mask++) {
    let mass = 0,
      weightedPrevious = 0;
    for (let j = 0; j < p.length; j++)
      if (mask & (1 << j)) {
        mass += p[j];
        weightedPrevious += p[j] * expectations[mask ^ (1 << j)];
      }
    expectations[mask] = (1 + weightedPrevious) / mass;
  }
  const expected = expectations[expectations.length - 1];
  return {
    unownedTargetItemCount: p.length,
    expectedBoxesToCompleteTargets: nonnegative(expected, "expectation"),
    expectedAdditionalCollectionCost: expected * input.callerCostPerBox,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetItemProbabilities: [0.5, 0.5],
  alreadyOwnedFlags: [0, 0],
  callerCostPerBox: 2,
} satisfies Input;
export const exampleOutput = {
  unownedTargetItemCount: 2,
  expectedBoxesToCompleteTargets: 3,
  expectedAdditionalCollectionCost: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/loot-box-expected-cost-per-item",
  title: "Loot Box Expected Cost Per Item",
  description:
    "Compute bounded unequal-probability coupon-collection expectation by stable subset waiting-time recurrence for all remaining caller target items, accounting for owned items and non-target mass; one exclusive award per independent box, no pity/trading/refunds.",
  inputs: inputFields,
  outputs: [
    {
      id: "unownedTargetItemCount",
      label: "Unowned target item count",
      kind: "number",
    },
    {
      id: "expectedBoxesToCompleteTargets",
      label: "Expected boxes to complete targets",
      kind: "number",
    },
    {
      id: "expectedAdditionalCollectionCost",
      label: "Expected additional collection cost",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetItemProbabilities:
        value.targetItemProbabilities as readonly number[],
      alreadyOwnedFlags: value.alreadyOwnedFlags as readonly number[],
      callerCostPerBox: value.callerCostPerBox as number,
    }),
});
export const run = tool.execute;
export default tool;
