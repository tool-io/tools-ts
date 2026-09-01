import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedMissedGreenOpportunities: readonly number[];
  readonly observedParOrBetterRecoveries: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledObservedScramblingPercent: number;
}>;
const inputFields = [
  {
    id: "observedMissedGreenOpportunities",
    label: "Observed missed green opportunities",
    kind: "numberList",
  },
  {
    id: "observedParOrBetterRecoveries",
    label: "Observed par or better recoveries",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMissedGreenOpportunities,
    input.observedParOrBetterRecoveries,
    "rounds",
  );
  input.observedMissedGreenOpportunities.forEach((v) =>
    bounded(v, "opportunities", 0, 1000),
  );
  input.observedParOrBetterRecoveries.forEach((v, i) =>
    bounded(v, "recoveries", 0, input.observedMissedGreenOpportunities[i]),
  );
  positive(sum(input.observedMissedGreenOpportunities), "knownOpportunities");
  return {
    pooledObservedScramblingPercent:
      (100 * sum(input.observedParOrBetterRecoveries)) /
      sum(input.observedMissedGreenOpportunities),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMissedGreenOpportunities: [5, 10],
  observedParOrBetterRecoveries: [2, 4],
} satisfies Input;
export const exampleOutput = {
  pooledObservedScramblingPercent: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-scrambling-percent-up-down",
  title: "Scrambling Up-and-Down Percent",
  description:
    "Pool actual par-or-better recovery counts conditional on missed greens; denominator excludes hits, no invented up/down difficulty or causality.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedScramblingPercent",
      label: "Pooled observed scrambling percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMissedGreenOpportunities:
        value.observedMissedGreenOpportunities as readonly number[],
      observedParOrBetterRecoveries:
        value.observedParOrBetterRecoveries as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
