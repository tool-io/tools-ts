import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedBenchTopElevationsM: readonly number[];
  readonly observedBenchToeElevationsM: readonly number[];
  readonly callerMatchedMaximumBenchHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBenchHeightsM: readonly number[];
  readonly benchHeightReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBenchTopElevationsM",
    label: "Observed bench top elevations m",
    kind: "numberList",
  },
  {
    id: "observedBenchToeElevationsM",
    label: "Observed bench toe elevations m",
    kind: "numberList",
  },
  {
    id: "callerMatchedMaximumBenchHeightsM",
    label: "Caller matched maximum bench heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedMaximumBenchHeightsM.forEach((v) =>
    positive(v, "callerMatchedMaximumBenchHeightsM"),
  );
  aligned(
    input.observedBenchTopElevationsM,
    input.observedBenchToeElevationsM,
    "observedBenchTopElevationsM",
  );
  aligned(
    input.observedBenchTopElevationsM,
    input.callerMatchedMaximumBenchHeightsM,
    "observedBenchTopElevationsM",
  );
  const height = input.observedBenchTopElevationsM.map(
    (v, i) => v - input.observedBenchToeElevationsM[i],
  );
  height.forEach((v) => nonnegative(v, "height"));
  return {
    observedBenchHeightsM: height,
    benchHeightReviewIndices: height.flatMap((v, i) =>
      v > input.callerMatchedMaximumBenchHeightsM[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBenchTopElevationsM: [100, 200],
  observedBenchToeElevationsM: [90, 185],
  callerMatchedMaximumBenchHeightsM: [12, 12],
} satisfies Input;
export const exampleOutput = {
  observedBenchHeightsM: [10, 15],
  benchHeightReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bench-height",
  title: "Bench Height Calculator",
  description:
    "Audit actual bench top/toe level inventory against independently established height bounds, not overall pit slope or a bench design standard. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBenchHeightsM",
      label: "Observed bench heights m",
      kind: "numberList",
    },
    {
      id: "benchHeightReviewIndices",
      label: "Bench height review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBenchTopElevationsM:
        value.observedBenchTopElevationsM as readonly number[],
      observedBenchToeElevationsM:
        value.observedBenchToeElevationsM as readonly number[],
      callerMatchedMaximumBenchHeightsM:
        value.callerMatchedMaximumBenchHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
