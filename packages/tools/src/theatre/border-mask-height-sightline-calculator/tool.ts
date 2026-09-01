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
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly audienceEyeHeightsM: readonly number[];
  readonly audienceToBorderDistancesM: readonly number[];
  readonly borderToHiddenTargetDistanceM: number;
  readonly hiddenTargetHeightsM: readonly number[];
  readonly observedBorderBottomHeightM: number;
}>;
export type Output = Readonly<{
  readonly requiredMaximumBorderBottomHeightsM: readonly number[];
  readonly insufficientMaskingSeatIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "audienceEyeHeightsM",
    label: "Audience eye heights m",
    kind: "numberList",
  },
  {
    id: "audienceToBorderDistancesM",
    label: "Audience to border distances m",
    kind: "numberList",
  },
  {
    id: "borderToHiddenTargetDistanceM",
    label: "Border to hidden target distance m",
    kind: "number",
  },
  {
    id: "hiddenTargetHeightsM",
    label: "Hidden target heights m",
    kind: "numberList",
  },
  {
    id: "observedBorderBottomHeightM",
    label: "Observed border bottom height m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.audienceToBorderDistancesM.forEach((v) =>
    positive(v, "audienceToBorderDistancesM"),
  );
  nonnegative(
    input.borderToHiddenTargetDistanceM,
    "borderToHiddenTargetDistanceM",
  );
  aligned(
    input.audienceEyeHeightsM,
    input.audienceToBorderDistancesM,
    "audienceEyeHeightsM",
  );
  aligned(
    input.audienceEyeHeightsM,
    input.hiddenTargetHeightsM,
    "audienceEyeHeightsM",
  );
  const heights = input.audienceEyeHeightsM.map((eye, i) => {
    const distance =
        input.audienceToBorderDistancesM[i] +
        input.borderToHiddenTargetDistanceM,
      rise = input.hiddenTargetHeightsM[i] - eye;
    if (!Number.isFinite(distance) || !Number.isFinite(rise))
      simpleError("ray", "Finite geometric interpolation spans required.");
    const t = input.audienceToBorderDistancesM[i] / distance;
    return eye * (1 - t) + input.hiddenTargetHeightsM[i] * t;
  });
  return {
    requiredMaximumBorderBottomHeightsM: heights,
    insufficientMaskingSeatIndices: heights.flatMap((v, i) =>
      input.observedBorderBottomHeightM > v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  audienceEyeHeightsM: [1, 2],
  audienceToBorderDistancesM: [4, 4],
  borderToHiddenTargetDistanceM: 4,
  hiddenTargetHeightsM: [5, 6],
  observedBorderBottomHeightM: 3.5,
} satisfies Input;
export const exampleOutput = {
  requiredMaximumBorderBottomHeightsM: [3, 4],
  insufficientMaskingSeatIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/border-mask-height-sightline-calculator",
  title: "Border Mask Height Sightline Calculator",
  description:
    "Intersect supplied audience-eye/hidden-target rays with border plane; ideal local 2D masking screen, not generic seat-angle summaries, full 3D visibility or rigging/egress clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredMaximumBorderBottomHeightsM",
      label: "Required maximum border bottom heights m",
      kind: "numberList",
    },
    {
      id: "insufficientMaskingSeatIndices",
      label: "Insufficient masking seat indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      audienceEyeHeightsM: value.audienceEyeHeightsM as readonly number[],
      audienceToBorderDistancesM:
        value.audienceToBorderDistancesM as readonly number[],
      borderToHiddenTargetDistanceM:
        value.borderToHiddenTargetDistanceM as number,
      hiddenTargetHeightsM: value.hiddenTargetHeightsM as readonly number[],
      observedBorderBottomHeightM: value.observedBorderBottomHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
