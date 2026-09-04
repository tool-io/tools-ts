import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedStartingPushForcesN: readonly number[];
  readonly matchedSustainedPushForcesN: readonly number[];
  readonly callerMaxRatio: number;
}>;
export type Output = Readonly<{
  readonly startSustainedRatios: readonly number[];
  readonly callerRatioReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedStartingPushForcesN",
    label: "Observed starting push forces n",
    kind: "numberList",
  },
  {
    id: "matchedSustainedPushForcesN",
    label: "Matched sustained push forces n",
    kind: "numberList",
  },
  { id: "callerMaxRatio", label: "Caller max ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedSustainedPushForcesN.forEach((v) =>
    positive(v, "matchedSustainedPushForcesN"),
  );
  positive(input.callerMaxRatio, "callerMaxRatio");
  input.observedStartingPushForcesN.forEach((v) =>
    nonnegative(v, "observedStartingPushForcesN"),
  );
  aligned(
    input.observedStartingPushForcesN,
    input.matchedSustainedPushForcesN,
    "observedStartingPushForcesN",
  );
  return {
    startSustainedRatios: input.observedStartingPushForcesN.map(
      (v, i) => v / input.matchedSustainedPushForcesN[i],
    ),
    callerRatioReviewIndices: input.observedStartingPushForcesN.flatMap(
      (v, i) =>
        v / input.matchedSustainedPushForcesN[i] > input.callerMaxRatio
          ? [i]
          : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStartingPushForcesN: [100, 120],
  matchedSustainedPushForcesN: [50, 40],
  callerMaxRatio: 2,
} satisfies Input;
export const exampleOutput = {
  startSustainedRatios: [2, 3],
  callerRatioReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/cart-start-sustained-ratio-checker",
  title: "Cart Push Force Start vs Sustained Ratio Checker",
  description:
    "Actual same-cart start/sustained push ratios vs caller limit; not allowable push force or general rolling resistance. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "startSustainedRatios",
      label: "Start sustained ratios",
      kind: "numberList",
    },
    {
      id: "callerRatioReviewIndices",
      label: "Caller ratio review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStartingPushForcesN:
        value.observedStartingPushForcesN as readonly number[],
      matchedSustainedPushForcesN:
        value.matchedSustainedPushForcesN as readonly number[],
      callerMaxRatio: value.callerMaxRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
