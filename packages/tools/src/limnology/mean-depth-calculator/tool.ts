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
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedLakeVolumeM3: number;
  readonly matchedSurfaceAreaM2: number;
  readonly observedMaximumDepthM: number;
}>;
export type Output = Readonly<{
  readonly observedMeanDepthM: number;
  readonly meanDepthToMaximumDepthFraction: number;
}>;
const inputFields = [
  {
    id: "observedLakeVolumeM3",
    label: "Observed lake volume m3",
    kind: "number",
  },
  {
    id: "matchedSurfaceAreaM2",
    label: "Matched surface area m2",
    kind: "number",
  },
  {
    id: "observedMaximumDepthM",
    label: "Observed maximum depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.matchedSurfaceAreaM2, "matchedSurfaceAreaM2");
  positive(input.observedMaximumDepthM, "observedMaximumDepthM");
  nonnegative(input.observedLakeVolumeM3, "observedLakeVolumeM3");
  const meanDepth = input.observedLakeVolumeM3 / input.matchedSurfaceAreaM2;
  if (meanDepth > input.observedMaximumDepthM)
    simpleError(
      "geometry",
      "Mean depth cannot exceed matched observed maximum depth.",
    );
  return {
    observedMeanDepthM: meanDepth,
    meanDepthToMaximumDepthFraction: meanDepth / input.observedMaximumDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLakeVolumeM3: 1000,
  matchedSurfaceAreaM2: 100,
  observedMaximumDepthM: 20,
} satisfies Input;
export const exampleOutput = {
  observedMeanDepthM: 10,
  meanDepthToMaximumDepthFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/mean-depth-calculator",
  title: "Mean Depth Calculator",
  description:
    "Audit matched volume/surface area for mean lake depth with independent maximum-depth consistency; not hypsographic integration or a shape-based inferred volume.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanDepthM",
      label: "Observed mean depth m",
      kind: "number",
    },
    {
      id: "meanDepthToMaximumDepthFraction",
      label: "Mean depth to maximum depth fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLakeVolumeM3: value.observedLakeVolumeM3 as number,
      matchedSurfaceAreaM2: value.matchedSurfaceAreaM2 as number,
      observedMaximumDepthM: value.observedMaximumDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
