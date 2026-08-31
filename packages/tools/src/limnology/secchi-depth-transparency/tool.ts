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
  mean,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly disappearanceDepthsM: readonly number[];
  readonly reappearanceDepthsM: readonly number[];
  readonly lakeBottomDepthM: number;
}>;
export type Output = Readonly<{
  readonly pairedSecchiDepthsM: readonly number[];
  readonly meanObservedSecchiDepthM: number;
  readonly halfDifferenceUncertaintiesM: readonly number[];
}>;
const inputFields = [
  {
    id: "disappearanceDepthsM",
    label: "Disappearance depths m",
    kind: "numberList",
  },
  {
    id: "reappearanceDepthsM",
    label: "Reappearance depths m",
    kind: "numberList",
  },
  { id: "lakeBottomDepthM", label: "Lake bottom depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lakeBottomDepthM, "lakeBottomDepthM");
  input.disappearanceDepthsM.forEach((v) =>
    nonnegative(v, "disappearanceDepthsM"),
  );
  input.reappearanceDepthsM.forEach((v) =>
    nonnegative(v, "reappearanceDepthsM"),
  );
  aligned(
    input.disappearanceDepthsM,
    input.reappearanceDepthsM,
    "disappearanceDepthsM",
  );
  if (
    [...input.disappearanceDepthsM, ...input.reappearanceDepthsM].some(
      (v) => v >= input.lakeBottomDepthM,
    )
  )
    simpleError(
      "secchi",
      "Bottom-censored transparency must not be treated as observed disk disappearance.",
    );
  const depths = input.disappearanceDepthsM.map(
    (v, i) => v / 2 + input.reappearanceDepthsM[i] / 2,
  );
  return {
    pairedSecchiDepthsM: depths,
    meanObservedSecchiDepthM: mean(depths),
    halfDifferenceUncertaintiesM: input.disappearanceDepthsM.map(
      (v, i) => Math.abs(v - input.reappearanceDepthsM[i]) / 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  disappearanceDepthsM: [1, 2],
  reappearanceDepthsM: [1.2, 2.2],
  lakeBottomDepthM: 3,
} satisfies Input;
export const exampleOutput = {
  pairedSecchiDepthsM: [1.1, 2.1],
  meanObservedSecchiDepthM: 1.6,
  halfDifferenceUncertaintiesM: [0.1, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/secchi-depth-transparency",
  title: "Secchi Depth Transparency Recorder",
  description:
    "Record actual paired Secchi disappearance/reappearance with disagreement uncertainty, rejecting bottom-censored readings rather than calling them measured transparency.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedSecchiDepthsM",
      label: "Paired secchi depths m",
      kind: "numberList",
    },
    {
      id: "meanObservedSecchiDepthM",
      label: "Mean observed secchi depth m",
      kind: "number",
    },
    {
      id: "halfDifferenceUncertaintiesM",
      label: "Half difference uncertainties m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      disappearanceDepthsM: value.disappearanceDepthsM as readonly number[],
      reappearanceDepthsM: value.reappearanceDepthsM as readonly number[],
      lakeBottomDepthM: value.lakeBottomDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
