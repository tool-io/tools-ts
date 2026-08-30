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
} from "../shared.js";
export type Input = Readonly<{
  readonly totalTreeHeightsM: readonly number[];
  readonly currentLiveCrownBaseHeightsM: readonly number[];
  readonly requestedPruningLiftHeightsM: readonly number[];
  readonly callerMinimumRetainedLiveCrownFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly postPruningLiveCrownFractions: readonly number[];
  readonly maximumLiftUnderCallerCrownConstraintM: readonly number[];
  readonly aboveCallerLiftConstraintFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "totalTreeHeightsM",
    label: "Total tree heights m",
    kind: "numberList",
  },
  {
    id: "currentLiveCrownBaseHeightsM",
    label: "Current live crown base heights m",
    kind: "numberList",
  },
  {
    id: "requestedPruningLiftHeightsM",
    label: "Requested pruning lift heights m",
    kind: "numberList",
  },
  {
    id: "callerMinimumRetainedLiveCrownFractions",
    label: "Caller minimum retained live crown fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.totalTreeHeightsM.forEach((v) => positive(v, "totalTreeHeightsM"));
  input.currentLiveCrownBaseHeightsM.forEach((v) =>
    nonnegative(v, "currentLiveCrownBaseHeightsM"),
  );
  input.requestedPruningLiftHeightsM.forEach((v) =>
    nonnegative(v, "requestedPruningLiftHeightsM"),
  );
  input.callerMinimumRetainedLiveCrownFractions.forEach((v) =>
    fraction(v, "callerMinimumRetainedLiveCrownFractions"),
  );
  aligned(
    input.totalTreeHeightsM,
    input.currentLiveCrownBaseHeightsM,
    "totalTreeHeightsM",
  );
  aligned(
    input.totalTreeHeightsM,
    input.requestedPruningLiftHeightsM,
    "totalTreeHeightsM",
  );
  aligned(
    input.totalTreeHeightsM,
    input.callerMinimumRetainedLiveCrownFractions,
    "totalTreeHeightsM",
  );
  if (
    input.totalTreeHeightsM.some(
      (h, i) =>
        input.currentLiveCrownBaseHeightsM[i] > h ||
        input.requestedPruningLiftHeightsM[i] > h,
    )
  )
    simpleError(
      "crown",
      "Crown base/pruning lift cannot exceed total tree height.",
    );
  const postPruningLiveCrownFractions = input.totalTreeHeightsM.map(
      (h, i) =>
        (h -
          Math.max(
            input.currentLiveCrownBaseHeightsM[i],
            input.requestedPruningLiftHeightsM[i],
          )) /
        h,
    ),
    maximumLiftUnderCallerCrownConstraintM = input.totalTreeHeightsM.map(
      (h, i) => h * (1 - input.callerMinimumRetainedLiveCrownFractions[i]),
    );
  return {
    postPruningLiveCrownFractions,
    maximumLiftUnderCallerCrownConstraintM,
    aboveCallerLiftConstraintFlags: postPruningLiveCrownFractions.map((v, i) =>
      v < input.callerMinimumRetainedLiveCrownFractions[i] ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalTreeHeightsM: [10, 20],
  currentLiveCrownBaseHeightsM: [2, 5],
  requestedPruningLiftHeightsM: [5, 15],
  callerMinimumRetainedLiveCrownFractions: [0.4, 0.4],
} satisfies Input;
export const exampleOutput = {
  postPruningLiveCrownFractions: [0.5, 0.25],
  maximumLiftUnderCallerCrownConstraintM: [6, 12],
  aboveCallerLiftConstraintFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/pruning-lift-height-to-hdb-green-crown",
  title: "Pruning Lift Height to HDB Green Crown",
  description:
    "Audit requested pruning lift against existing live crown geometry and caller retained-crown constraint; not existing crown ratio alone, stem-quality prediction or a pruning recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "postPruningLiveCrownFractions",
      label: "Post pruning live crown fractions",
      kind: "numberList",
    },
    {
      id: "maximumLiftUnderCallerCrownConstraintM",
      label: "Maximum lift under caller crown constraint m",
      kind: "numberList",
    },
    {
      id: "aboveCallerLiftConstraintFlags",
      label: "Above caller lift constraint flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      totalTreeHeightsM: value.totalTreeHeightsM as readonly number[],
      currentLiveCrownBaseHeightsM:
        value.currentLiveCrownBaseHeightsM as readonly number[],
      requestedPruningLiftHeightsM:
        value.requestedPruningLiftHeightsM as readonly number[],
      callerMinimumRetainedLiveCrownFractions:
        value.callerMinimumRetainedLiveCrownFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
