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
  readonly observedOpeningWidthsM: readonly number[];
  readonly observedBoundaryDominantHeightsM: readonly number[];
  readonly callerMaximumOpeningHeightRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedOpeningHeightRatios: readonly number[];
  readonly openingRatioReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOpeningWidthsM",
    label: "Observed opening widths m",
    kind: "numberList",
  },
  {
    id: "observedBoundaryDominantHeightsM",
    label: "Observed boundary dominant heights m",
    kind: "numberList",
  },
  {
    id: "callerMaximumOpeningHeightRatios",
    label: "Caller maximum opening height ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBoundaryDominantHeightsM.forEach((v) =>
    positive(v, "observedBoundaryDominantHeightsM"),
  );
  input.observedOpeningWidthsM.forEach((v) =>
    nonnegative(v, "observedOpeningWidthsM"),
  );
  input.callerMaximumOpeningHeightRatios.forEach((v) =>
    nonnegative(v, "callerMaximumOpeningHeightRatios"),
  );
  aligned(
    input.observedOpeningWidthsM,
    input.observedBoundaryDominantHeightsM,
    "observedOpeningWidthsM",
  );
  aligned(
    input.observedOpeningWidthsM,
    input.callerMaximumOpeningHeightRatios,
    "observedOpeningWidthsM",
  );
  const ratios = input.observedOpeningWidthsM.map(
    (v, i) => v / input.observedBoundaryDominantHeightsM[i],
  );
  return {
    observedOpeningHeightRatios: ratios,
    openingRatioReviewIndices: ratios.flatMap((v, i) =>
      v > input.callerMaximumOpeningHeightRatios[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOpeningWidthsM: [10, 20],
  observedBoundaryDominantHeightsM: [10, 10],
  callerMaximumOpeningHeightRatios: [1.5, 1.5],
} satisfies Input;
export const exampleOutput = {
  observedOpeningHeightRatios: [1, 2],
  openingRatioReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/clearcut-size-opening-width-windthrow-checker",
  title: "Clearcut Opening Width Windthrow Checker",
  description:
    "Audit actual clearcut opening-width/boundary-height exposure under independently verified local criterion, not windthrow probability or safe opening size. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOpeningHeightRatios",
      label: "Observed opening height ratios",
      kind: "numberList",
    },
    {
      id: "openingRatioReviewIndices",
      label: "Opening ratio review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOpeningWidthsM: value.observedOpeningWidthsM as readonly number[],
      observedBoundaryDominantHeightsM:
        value.observedBoundaryDominantHeightsM as readonly number[],
      callerMaximumOpeningHeightRatios:
        value.callerMaximumOpeningHeightRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
