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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedKnotDiametersMm: readonly number[];
  readonly observedBoleDiametersMm: readonly number[];
  readonly observedCurrentLiveCrownLengthsM: readonly number[];
  readonly callerRemovedLiveCrownLengthsM: readonly number[];
  readonly callerMinimumRetainedCrownFraction: number;
}>;
export type Output = Readonly<{
  readonly observedKnotDiameterRatios: readonly number[];
  readonly retainedLiveCrownFractions: readonly number[];
  readonly callerCrownReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedKnotDiametersMm",
    label: "Observed knot diameters mm",
    kind: "numberList",
  },
  {
    id: "observedBoleDiametersMm",
    label: "Observed bole diameters mm",
    kind: "numberList",
  },
  {
    id: "observedCurrentLiveCrownLengthsM",
    label: "Observed current live crown lengths m",
    kind: "numberList",
  },
  {
    id: "callerRemovedLiveCrownLengthsM",
    label: "Caller removed live crown lengths m",
    kind: "numberList",
  },
  {
    id: "callerMinimumRetainedCrownFraction",
    label: "Caller minimum retained crown fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBoleDiametersMm.forEach((v) =>
    positive(v, "observedBoleDiametersMm"),
  );
  input.observedCurrentLiveCrownLengthsM.forEach((v) =>
    positive(v, "observedCurrentLiveCrownLengthsM"),
  );
  input.observedKnotDiametersMm.forEach((v) =>
    nonnegative(v, "observedKnotDiametersMm"),
  );
  input.callerRemovedLiveCrownLengthsM.forEach((v) =>
    nonnegative(v, "callerRemovedLiveCrownLengthsM"),
  );
  fraction(
    input.callerMinimumRetainedCrownFraction,
    "callerMinimumRetainedCrownFraction",
  );
  aligned(
    input.observedKnotDiametersMm,
    input.observedBoleDiametersMm,
    "observedKnotDiametersMm",
  );
  aligned(
    input.observedKnotDiametersMm,
    input.observedCurrentLiveCrownLengthsM,
    "observedKnotDiametersMm",
  );
  aligned(
    input.observedKnotDiametersMm,
    input.callerRemovedLiveCrownLengthsM,
    "observedKnotDiametersMm",
  );
  const retained = input.observedCurrentLiveCrownLengthsM.map((v, i) => {
    if (input.callerRemovedLiveCrownLengthsM[i] > v)
      simpleError(
        "crown",
        "Removal≤current independently measured live crown.",
      );
    return 1 - input.callerRemovedLiveCrownLengthsM[i] / v;
  });
  return {
    observedKnotDiameterRatios: input.observedKnotDiametersMm.map(
      (v, i) => v / input.observedBoleDiametersMm[i],
    ),
    retainedLiveCrownFractions: retained,
    callerCrownReviewIndices: retained.flatMap((v, i) =>
      v < input.callerMinimumRetainedCrownFraction ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKnotDiametersMm: [5, 10],
  observedBoleDiametersMm: [100, 100],
  observedCurrentLiveCrownLengthsM: [5, 5],
  callerRemovedLiveCrownLengthsM: [1, 2],
  callerMinimumRetainedCrownFraction: 0.7,
} satisfies Input;
export const exampleOutput = {
  observedKnotDiameterRatios: [0.05, 0.1],
  retainedLiveCrownFractions: [0.8, 0.6],
  callerCrownReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/knot-index-pruning-live-crown-limit",
  title: "Pruning Knot Index Live Crown Limit Checker",
  description:
    "Audit actual knot/wood diameter contrasts alongside independently specified retained live-crown criterion, distinct from pruning lift alone, no pruning treatment or future wood quality prediction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedKnotDiameterRatios",
      label: "Observed knot diameter ratios",
      kind: "numberList",
    },
    {
      id: "retainedLiveCrownFractions",
      label: "Retained live crown fractions",
      kind: "numberList",
    },
    {
      id: "callerCrownReviewIndices",
      label: "Caller crown review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedKnotDiametersMm:
        value.observedKnotDiametersMm as readonly number[],
      observedBoleDiametersMm:
        value.observedBoleDiametersMm as readonly number[],
      observedCurrentLiveCrownLengthsM:
        value.observedCurrentLiveCrownLengthsM as readonly number[],
      callerRemovedLiveCrownLengthsM:
        value.callerRemovedLiveCrownLengthsM as readonly number[],
      callerMinimumRetainedCrownFraction:
        value.callerMinimumRetainedCrownFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
