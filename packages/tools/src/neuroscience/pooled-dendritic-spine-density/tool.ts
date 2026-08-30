import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentLengthsMicrometers: readonly number[];
  readonly spineCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentDensitiesPerMicrometer: readonly number[];
  readonly pooledDensityPerMicrometer: number;
  readonly meanSegmentDensityPerMicrometer: number;
}>;
const inputFields = [
  {
    id: "segmentLengthsMicrometers",
    label: "Segment lengths micrometers",
    kind: "numberList",
  },
  { id: "spineCounts", label: "Spine counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.segmentLengthsMicrometers,
    input.spineCounts,
    "segmentLengthsMicrometers",
  );
  input.segmentLengthsMicrometers.forEach((v) =>
    positive(v, "segmentLengthsMicrometers"),
  );
  input.spineCounts.forEach((v) => count(v, "spineCounts"));
  const segmentDensitiesPerMicrometer = input.spineCounts.map(
    (v, i) => v / input.segmentLengthsMicrometers[i],
  );
  return {
    segmentDensitiesPerMicrometer,
    pooledDensityPerMicrometer:
      input.spineCounts.reduce((a, b) => a + b, 0) /
      input.segmentLengthsMicrometers.reduce((a, b) => a + b, 0),
    meanSegmentDensityPerMicrometer: mean(segmentDensitiesPerMicrometer),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentLengthsMicrometers: [10, 20],
  spineCounts: [5, 20],
} satisfies Input;
export const exampleOutput = {
  segmentDensitiesPerMicrometer: [0.5, 1],
  pooledDensityPerMicrometer: 0.8333333333333334,
  meanSegmentDensityPerMicrometer: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/pooled-dendritic-spine-density",
  title: "Dendritic Spine Density",
  description:
    "Compare length-weighted pooled spine density with the unweighted average of segment densities; detection/segmentation and sampling bias are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentDensitiesPerMicrometer",
      label: "Segment densities per micrometer",
      kind: "numberList",
    },
    {
      id: "pooledDensityPerMicrometer",
      label: "Pooled density per micrometer",
      kind: "number",
    },
    {
      id: "meanSegmentDensityPerMicrometer",
      label: "Mean segment density per micrometer",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentLengthsMicrometers:
        value.segmentLengthsMicrometers as readonly number[],
      spineCounts: value.spineCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
