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
  bounded,
  mean,
  finite,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedScoreDifferentials: readonly number[];
  readonly callerLowestDifferentialsToUse: number;
  readonly callerIndexMultiplier: number;
  readonly callerExceptionalAdjustment: number;
  readonly callerIndexUpperCap: number;
}>;
export type Output = Readonly<{
  readonly selectedScoreDifferentials: readonly number[];
  readonly callerComputedHandicapIndex: number;
}>;
const inputFields = [
  {
    id: "observedScoreDifferentials",
    label: "Observed score differentials",
    kind: "numberList",
  },
  {
    id: "callerLowestDifferentialsToUse",
    label: "Caller lowest differentials to use",
    kind: "number",
  },
  {
    id: "callerIndexMultiplier",
    label: "Caller index multiplier",
    kind: "number",
  },
  {
    id: "callerExceptionalAdjustment",
    label: "Caller exceptional adjustment",
    kind: "number",
  },
  {
    id: "callerIndexUpperCap",
    label: "Caller index upper cap",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerIndexMultiplier, "callerIndexMultiplier");
  nonnegative(input.callerIndexUpperCap, "callerIndexUpperCap");
  input.observedScoreDifferentials.forEach((v) => {
    if (Math.abs(v) > 100)
      simpleError(
        "differential",
        "Bounded finite score differentials required.",
      );
  });
  bounded(
    input.callerLowestDifferentialsToUse,
    "count",
    1,
    input.observedScoreDifferentials.length,
  );
  const selected = [...input.observedScoreDifferentials]
      .sort((a, b) => a - b)
      .slice(0, input.callerLowestDifferentialsToUse),
    index = Math.min(
      input.callerIndexUpperCap,
      mean(selected) * input.callerIndexMultiplier +
        input.callerExceptionalAdjustment,
    );
  return {
    selectedScoreDifferentials: selected,
    callerComputedHandicapIndex: Math.round(finite(index * 10)) / 10,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScoreDifferentials: [10, 12, 15, 8, 11],
  callerLowestDifferentialsToUse: 3,
  callerIndexMultiplier: 1,
  callerExceptionalAdjustment: 0,
  callerIndexUpperCap: 54,
} satisfies Input;
export const exampleOutput = {
  selectedScoreDifferentials: [8, 10, 11],
  callerComputedHandicapIndex: 9.7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-handicap-index-usga",
  title: "USGA Golf Handicap Index Calculator",
  description:
    "Evaluate supplied USGA/WHS score differential selection/multiplier/adjustment policy with nearest-tenth index and caller cap; no inferred policy edition, membership eligibility, playing handicap or official certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "selectedScoreDifferentials",
      label: "Selected score differentials",
      kind: "numberList",
    },
    {
      id: "callerComputedHandicapIndex",
      label: "Caller computed handicap index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedScoreDifferentials:
        value.observedScoreDifferentials as readonly number[],
      callerLowestDifferentialsToUse:
        value.callerLowestDifferentialsToUse as number,
      callerIndexMultiplier: value.callerIndexMultiplier as number,
      callerExceptionalAdjustment: value.callerExceptionalAdjustment as number,
      callerIndexUpperCap: value.callerIndexUpperCap as number,
    }),
});
export const run = tool.execute;
export default tool;
