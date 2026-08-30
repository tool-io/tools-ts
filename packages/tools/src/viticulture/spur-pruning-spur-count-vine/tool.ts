import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerTargetBurstShootsPerVine: readonly number[];
  readonly budsRetainedPerSpur: readonly number[];
  readonly callerBudBurstFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredWholeSpursByVine: readonly number[];
  readonly expectedShootsFromWholeSpurs: readonly number[];
}>;
const inputFields = [
  {
    id: "callerTargetBurstShootsPerVine",
    label: "Caller target burst shoots per vine",
    kind: "numberList",
  },
  {
    id: "budsRetainedPerSpur",
    label: "Buds retained per spur",
    kind: "numberList",
  },
  {
    id: "callerBudBurstFractions",
    label: "Caller bud burst fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.budsRetainedPerSpur.forEach((v) => positive(v, "budsRetainedPerSpur"));
  input.callerBudBurstFractions.forEach((v) =>
    positive(v, "callerBudBurstFractions"),
  );
  input.callerTargetBurstShootsPerVine.forEach((v) =>
    nonnegative(v, "callerTargetBurstShootsPerVine"),
  );
  input.callerBudBurstFractions.forEach((v) =>
    fraction(v, "callerBudBurstFractions"),
  );
  input.budsRetainedPerSpur.forEach((v) => count(v, "budsRetainedPerSpur"));
  aligned(
    input.callerTargetBurstShootsPerVine,
    input.budsRetainedPerSpur,
    "callerTargetBurstShootsPerVine",
  );
  aligned(
    input.callerTargetBurstShootsPerVine,
    input.callerBudBurstFractions,
    "callerTargetBurstShootsPerVine",
  );
  const requiredWholeSpursByVine = input.callerTargetBurstShootsPerVine.map(
    (v, i) =>
      safeCeil(
        v / (input.budsRetainedPerSpur[i] * input.callerBudBurstFractions[i]),
        "wholeSpurs",
      ),
  );
  return {
    requiredWholeSpursByVine,
    expectedShootsFromWholeSpurs: requiredWholeSpursByVine.map(
      (v, i) =>
        v * input.budsRetainedPerSpur[i] * input.callerBudBurstFractions[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTargetBurstShootsPerVine: [10, 15],
  budsRetainedPerSpur: [2, 3],
  callerBudBurstFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  requiredWholeSpursByVine: [10, 5],
  expectedShootsFromWholeSpurs: [10, 15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/spur-pruning-spur-count-vine",
  title: "Spur Pruning Spur Count Per Vine",
  description:
    "Invert caller shoot demand to whole spur counts using retained buds and explicit burst assumptions, retaining expected overage after rounding; not actual fruitful shoots or a pruning prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeSpursByVine",
      label: "Required whole spurs by vine",
      kind: "numberList",
    },
    {
      id: "expectedShootsFromWholeSpurs",
      label: "Expected shoots from whole spurs",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTargetBurstShootsPerVine:
        value.callerTargetBurstShootsPerVine as readonly number[],
      budsRetainedPerSpur: value.budsRetainedPerSpur as readonly number[],
      callerBudBurstFractions:
        value.callerBudBurstFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
