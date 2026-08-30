import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly baseCurtainCenterSpacingM: number;
  readonly curtainVerticalHeightM: number;
  readonly outwardLeanFromVerticalDegrees: number;
  readonly horizontalCurtainThicknessM: number;
}>;
export type Output = Readonly<{
  readonly topCurtainCenterSpacingM: number;
  readonly modeledClearTopOpeningM: number;
}>;
const inputFields = [
  {
    id: "baseCurtainCenterSpacingM",
    label: "Base curtain center spacing m",
    kind: "number",
  },
  {
    id: "curtainVerticalHeightM",
    label: "Curtain vertical height m",
    kind: "number",
  },
  {
    id: "outwardLeanFromVerticalDegrees",
    label: "Outward lean from vertical degrees",
    kind: "number",
  },
  {
    id: "horizontalCurtainThicknessM",
    label: "Horizontal curtain thickness m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.baseCurtainCenterSpacingM, "baseCurtainCenterSpacingM");
  nonnegative(input.curtainVerticalHeightM, "curtainVerticalHeightM");
  nonnegative(input.horizontalCurtainThicknessM, "horizontalCurtainThicknessM");
  if (
    input.outwardLeanFromVerticalDegrees < 0 ||
    input.outwardLeanFromVerticalDegrees >= 90
  )
    simpleError("lean", "Outward lean in [0,90) required.");
  const topCurtainCenterSpacingM =
      input.baseCurtainCenterSpacingM +
      2 *
        input.curtainVerticalHeightM *
        Math.tan((input.outwardLeanFromVerticalDegrees * Math.PI) / 180),
    modeledClearTopOpeningM = nonnegative(
      topCurtainCenterSpacingM - input.horizontalCurtainThicknessM,
      "curtainThickness",
    );
  return { topCurtainCenterSpacingM, modeledClearTopOpeningM };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseCurtainCenterSpacingM: 1,
  curtainVerticalHeightM: 1,
  outwardLeanFromVerticalDegrees: 45,
  horizontalCurtainThicknessM: 0.2,
} satisfies Input;
export const exampleOutput = {
  topCurtainCenterSpacingM: 3,
  modeledClearTopOpeningM: 2.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/lyre-system-row-width-opening",
  title: "Lyre System Row Width Opening",
  description:
    "Evaluate symmetric Lyre curtain center geometry and declared horizontal foliage thickness before reporting clear top gap; not trellis engineering, arbitrary row width or canopy illumination guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "topCurtainCenterSpacingM",
      label: "Top curtain center spacing m",
      kind: "number",
    },
    {
      id: "modeledClearTopOpeningM",
      label: "Modeled clear top opening m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      baseCurtainCenterSpacingM: value.baseCurtainCenterSpacingM as number,
      curtainVerticalHeightM: value.curtainVerticalHeightM as number,
      outwardLeanFromVerticalDegrees:
        value.outwardLeanFromVerticalDegrees as number,
      horizontalCurtainThicknessM: value.horizontalCurtainThicknessM as number,
    }),
});
export const run = tool.execute;
export default tool;
