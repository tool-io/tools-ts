import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleIds: readonly string[];
  readonly pcOne: readonly number[];
  readonly pcTwo: readonly number[];
  readonly centerPcOne: number;
  readonly centerPcTwo: number;
  readonly radius: number;
}>;
export type Output = Readonly<{
  readonly outlierIds: readonly string[];
  readonly distances: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.sampleIds.length;
  if (
    n === 0 ||
    input.pcOne.length !== n ||
    input.pcTwo.length !== n ||
    input.radius < 0
  )
    simpleError(
      "sampleIds",
      "Aligned sample PCA coordinates and radius required.",
    );
  const distances = input.pcOne.map((v, i) =>
    Math.hypot(v - input.centerPcOne, input.pcTwo[i] - input.centerPcTwo),
  );
  return {
    outlierIds: input.sampleIds.filter((_, i) => distances[i] > input.radius),
    distances,
  };
};

export const exampleInput = {
  sampleIds: ["a", "b", "c"],
  pcOne: [0, 1, 10],
  pcTwo: [0, 1, 10],
  centerPcOne: 0,
  centerPcTwo: 0,
  radius: 5,
} satisfies Input;
export const exampleOutput = {
  outlierIds: ["c"],
  distances: [0, 1.4142135623730951, 14.142135623730951],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/pca-outlier-screen",
  title: "PCA Outlier Screen",
  description: "Flag PCA samples outside a caller-selected radius.",
  inputs: [
    { id: "sampleIds", kind: "stringList", label: "Sample ids" },
    { id: "pcOne", kind: "numberList", label: "Pc one" },
    { id: "pcTwo", kind: "numberList", label: "Pc two" },
    { id: "centerPcOne", kind: "number", label: "Center pc one" },
    { id: "centerPcTwo", kind: "number", label: "Center pc two" },
    { id: "radius", kind: "number", label: "Radius" },
  ],
  outputs: [
    { id: "outlierIds", kind: "stringList", label: "Outlier ids" },
    { id: "distances", kind: "numberList", label: "Distances" },
  ],
  calculate: (value) =>
    calculate({
      sampleIds: value.sampleIds as readonly string[],
      pcOne: value.pcOne as readonly number[],
      pcTwo: value.pcTwo as readonly number[],
      centerPcOne: value.centerPcOne as number,
      centerPcTwo: value.centerPcTwo as number,
      radius: value.radius as number,
    }),
});
export const run = tool.execute;
export default tool;
