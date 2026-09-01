import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly backstagePlayableDepthM: number;
  readonly thrustExtensionDepthM: number;
  readonly mainStageWidthM: number;
  readonly thrustWidthM: number;
}>;
export type Output = Readonly<{
  readonly totalLongitudinalPlayingDepthM: number;
  readonly nonoverlappingPlayingAreaM2: number;
  readonly thrustShareOfPlayingArea: number;
}>;
const inputFields = [
  {
    id: "backstagePlayableDepthM",
    label: "Backstage playable depth m",
    kind: "number",
  },
  {
    id: "thrustExtensionDepthM",
    label: "Thrust extension depth m",
    kind: "number",
  },
  { id: "mainStageWidthM", label: "Main stage width m", kind: "number" },
  { id: "thrustWidthM", label: "Thrust width m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.mainStageWidthM, "mainStageWidthM");
  positive(input.thrustWidthM, "thrustWidthM");
  nonnegative(input.backstagePlayableDepthM, "backstagePlayableDepthM");
  nonnegative(input.thrustExtensionDepthM, "thrustExtensionDepthM");
  const area =
    input.backstagePlayableDepthM * input.mainStageWidthM +
    input.thrustExtensionDepthM * input.thrustWidthM;
  positive(area, "playingArea");
  return {
    totalLongitudinalPlayingDepthM:
      input.backstagePlayableDepthM + input.thrustExtensionDepthM,
    nonoverlappingPlayingAreaM2: area,
    thrustShareOfPlayingArea:
      (input.thrustExtensionDepthM * input.thrustWidthM) / area,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  backstagePlayableDepthM: 5,
  thrustExtensionDepthM: 3,
  mainStageWidthM: 8,
  thrustWidthM: 4,
} satisfies Input;
export const exampleOutput = {
  totalLongitudinalPlayingDepthM: 8,
  nonoverlappingPlayingAreaM2: 52,
  thrustShareOfPlayingArea: 0.23076923076923078,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/stage-depth-thrust-extension-lookup",
  title: "Stage Depth Thrust Extension Lookup",
  description:
    "Inventory actual abutting rectangular main/thrust playing areas, not audience sightline ratios, overlap geometry or a universal thrust-depth recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalLongitudinalPlayingDepthM",
      label: "Total longitudinal playing depth m",
      kind: "number",
    },
    {
      id: "nonoverlappingPlayingAreaM2",
      label: "Nonoverlapping playing area m2",
      kind: "number",
    },
    {
      id: "thrustShareOfPlayingArea",
      label: "Thrust share of playing area",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      backstagePlayableDepthM: value.backstagePlayableDepthM as number,
      thrustExtensionDepthM: value.thrustExtensionDepthM as number,
      mainStageWidthM: value.mainStageWidthM as number,
      thrustWidthM: value.thrustWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
