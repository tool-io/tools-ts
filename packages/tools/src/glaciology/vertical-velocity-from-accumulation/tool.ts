import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly accumulationMweYear: number;
  readonly waterDensityKgM3: number;
  readonly iceDensityKgM3: number;
  readonly modeledIceThicknessM: number;
  readonly depthBelowSurfaceM: readonly number[];
}>;
export type Output = Readonly<{
  readonly idealVerticalVelocitiesMYear: readonly number[];
}>;
const inputFields = [
  { id: "accumulationMweYear", label: "Accumulation mwe year", kind: "number" },
  { id: "waterDensityKgM3", label: "Water density kg m3", kind: "number" },
  { id: "iceDensityKgM3", label: "Ice density kg m3", kind: "number" },
  {
    id: "modeledIceThicknessM",
    label: "Modeled ice thickness m",
    kind: "number",
  },
  {
    id: "depthBelowSurfaceM",
    label: "Depth below surface m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgM3, "waterDensityKgM3");
  positive(input.iceDensityKgM3, "iceDensityKgM3");
  positive(input.modeledIceThicknessM, "modeledIceThicknessM");
  input.depthBelowSurfaceM.forEach((v) => {
    if (v < 0 || v > input.modeledIceThicknessM)
      simpleError("depth", "Depth must lie inside modeled ice column.");
  });
  const rate =
    (input.accumulationMweYear * input.waterDensityKgM3) / input.iceDensityKgM3;
  return {
    idealVerticalVelocitiesMYear: input.depthBelowSurfaceM.map(
      (d) => -rate * (1 - d / input.modeledIceThicknessM),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accumulationMweYear: 1,
  waterDensityKgM3: 1000,
  iceDensityKgM3: 500,
  modeledIceThicknessM: 100,
  depthBelowSurfaceM: [0, 50, 100],
} satisfies Input;
export const exampleOutput = {
  idealVerticalVelocitiesMYear: [-2, -1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/vertical-velocity-from-accumulation",
  title: "Vertical Velocity From Accumulation Calculator",
  description:
    "Apply explicit ideal steady column linear vertical-velocity profile, surface w=−ice-equivalent accumulation and bed w=0; local vertical positive up, no inferred horizontal divergence, emergence or basal melt.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealVerticalVelocitiesMYear",
      label: "Ideal vertical velocities m year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      accumulationMweYear: value.accumulationMweYear as number,
      waterDensityKgM3: value.waterDensityKgM3 as number,
      iceDensityKgM3: value.iceDensityKgM3 as number,
      modeledIceThicknessM: value.modeledIceThicknessM as number,
      depthBelowSurfaceM: value.depthBelowSurfaceM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
