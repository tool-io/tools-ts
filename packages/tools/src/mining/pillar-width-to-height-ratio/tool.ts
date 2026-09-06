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
  readonly observedPillarMinimumWidthsM: readonly number[];
  readonly observedPillarHeightsM: readonly number[];
  readonly callerVerifiedRatioReviewFloors: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPillarWidthHeightRatios: readonly number[];
  readonly pillarRatioReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPillarMinimumWidthsM",
    label: "Observed pillar minimum widths m",
    kind: "numberList",
  },
  {
    id: "observedPillarHeightsM",
    label: "Observed pillar heights m",
    kind: "numberList",
  },
  {
    id: "callerVerifiedRatioReviewFloors",
    label: "Caller verified ratio review floors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPillarMinimumWidthsM.forEach((v) =>
    positive(v, "observedPillarMinimumWidthsM"),
  );
  input.observedPillarHeightsM.forEach((v) =>
    positive(v, "observedPillarHeightsM"),
  );
  input.callerVerifiedRatioReviewFloors.forEach((v) =>
    nonnegative(v, "callerVerifiedRatioReviewFloors"),
  );
  aligned(
    input.observedPillarMinimumWidthsM,
    input.observedPillarHeightsM,
    "observedPillarMinimumWidthsM",
  );
  aligned(
    input.observedPillarMinimumWidthsM,
    input.callerVerifiedRatioReviewFloors,
    "observedPillarMinimumWidthsM",
  );
  const r = input.observedPillarMinimumWidthsM.map(
    (v, i) => v / input.observedPillarHeightsM[i],
  );
  return {
    observedPillarWidthHeightRatios: r,
    pillarRatioReviewIndices: r.flatMap((v, i) =>
      v < input.callerVerifiedRatioReviewFloors[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPillarMinimumWidthsM: [2, 4],
  observedPillarHeightsM: [4, 2],
  callerVerifiedRatioReviewFloors: [1, 1],
} satisfies Input;
export const exampleOutput = {
  observedPillarWidthHeightRatios: [0.5, 2],
  pillarRatioReviewIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pillar-width-to-height-ratio",
  title: "Pillar Width to Height Ratio Calculator",
  description:
    "Audit actual minimum pillar width/height morphology with caller review floors, not empirical strength or support safety factor. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPillarWidthHeightRatios",
      label: "Observed pillar width height ratios",
      kind: "numberList",
    },
    {
      id: "pillarRatioReviewIndices",
      label: "Pillar ratio review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPillarMinimumWidthsM:
        value.observedPillarMinimumWidthsM as readonly number[],
      observedPillarHeightsM: value.observedPillarHeightsM as readonly number[],
      callerVerifiedRatioReviewFloors:
        value.callerVerifiedRatioReviewFloors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
