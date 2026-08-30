import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly lags: readonly number[];
  readonly firstTargetCorrectFlags: readonly number[];
  readonly secondTargetCorrectFlags: readonly number[];
  readonly baselineLag: number;
}>;
export type Output = Readonly<{
  readonly uniqueLags: readonly number[];
  readonly conditionalSecondTargetFractions: readonly number[];
  readonly baselineMinusLagFractions: readonly number[];
}>;
const inputFields = [
  { id: "lags", label: "Lags", kind: "numberList" },
  {
    id: "firstTargetCorrectFlags",
    label: "First target correct flags",
    kind: "numberList",
  },
  {
    id: "secondTargetCorrectFlags",
    label: "Second target correct flags",
    kind: "numberList",
  },
  { id: "baselineLag", label: "Baseline lag", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.lags, input.firstTargetCorrectFlags, "lags");
  aligned(input.lags, input.secondTargetCorrectFlags, "lags");
  input.lags.forEach((v) => count(v, "lags", 1));
  count(input.baselineLag, "baselineLag", 1);
  [input.firstTargetCorrectFlags, input.secondTargetCorrectFlags].forEach(
    (row) =>
      row.forEach((v) => {
        if (v !== 0 && v !== 1)
          simpleError("flags", "Binary target correctness flags required.");
      }),
  );
  const uniqueLags = [...new Set(input.lags)].sort((a, b) => a - b),
    conditionalSecondTargetFractions = uniqueLags.map((lag) => {
      const indexes = input.lags.flatMap((v, i) =>
        v === lag && input.firstTargetCorrectFlags[i] === 1 ? [i] : [],
      );
      if (!indexes.length)
        simpleError(
          "firstTargetCorrectFlags",
          "Each lag needs a correct-T1 trial.",
        );
      return mean(indexes.map((i) => input.secondTargetCorrectFlags[i]));
    }),
    b = uniqueLags.indexOf(input.baselineLag);
  if (b < 0) simpleError("baselineLag", "Baseline lag must be observed.");
  return {
    uniqueLags,
    conditionalSecondTargetFractions,
    baselineMinusLagFractions: conditionalSecondTargetFractions.map(
      (v) => conditionalSecondTargetFractions[b] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lags: [1, 1, 2, 2, 5, 5],
  firstTargetCorrectFlags: [1, 0, 1, 1, 1, 1],
  secondTargetCorrectFlags: [0, 1, 1, 0, 1, 1],
  baselineLag: 5,
} satisfies Input;
export const exampleOutput = {
  uniqueLags: [1, 2, 5],
  conditionalSecondTargetFractions: [0, 0.5, 1],
  baselineMinusLagFractions: [1, 0.5, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/conditional-attentional-blink-by-lag",
  title: "Attentional Blink Magnitude",
  description:
    "Compute T2 accuracy conditional on correct T1 by lag and subtract from a caller-selected baseline lag; preserves facilitation/negative deficits and does not infer a blink window.",
  inputs: inputFields,
  outputs: [
    { id: "uniqueLags", label: "Unique lags", kind: "numberList" },
    {
      id: "conditionalSecondTargetFractions",
      label: "Conditional second target fractions",
      kind: "numberList",
    },
    {
      id: "baselineMinusLagFractions",
      label: "Baseline minus lag fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lags: value.lags as readonly number[],
      firstTargetCorrectFlags:
        value.firstTargetCorrectFlags as readonly number[],
      secondTargetCorrectFlags:
        value.secondTargetCorrectFlags as readonly number[],
      baselineLag: value.baselineLag as number,
    }),
});
export const run = tool.execute;
export default tool;
