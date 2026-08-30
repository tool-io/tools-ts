import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pcOne: readonly number[];
  readonly pcTwo: readonly number[];
  readonly meanPcOne: number;
  readonly meanPcTwo: number;
  readonly covariance: readonly (readonly number[])[];
  readonly maximumT2: number;
}>;
export type Output = Readonly<{
  readonly tSquared: readonly number[];
  readonly outlierIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (
    input.pcOne.length === 0 ||
    input.pcOne.length !== input.pcTwo.length ||
    input.covariance.length !== 2 ||
    input.covariance.some((r) => r.length !== 2) ||
    input.maximumT2 < 0
  )
    simpleError(
      "covariance",
      "Aligned scores and two-by-two covariance required.",
    );
  const a = input.covariance,
    det = a[0][0] * a[1][1] - a[0][1] * a[1][0];
  if (det <= 0 || a[0][0] <= 0 || a[1][1] <= 0)
    simpleError("covariance", "Covariance must be positive definite.");
  const tSquared = input.pcOne.map((v, i) => {
    const x = v - input.meanPcOne,
      y = input.pcTwo[i] - input.meanPcTwo;
    return (
      (a[1][1] * x * x - (a[0][1] + a[1][0]) * x * y + a[0][0] * y * y) / det
    );
  });
  return {
    tSquared,
    outlierIndexes: tSquared.flatMap((v, i) =>
      v > input.maximumT2 ? [i] : [],
    ),
  };
};
export const exampleInput = {
  pcOne: [0, 2, 4],
  pcTwo: [0, 0, 0],
  meanPcOne: 0,
  meanPcTwo: 0,
  covariance: [
    [1, 0],
    [0, 1],
  ],
  maximumT2: 4,
} satisfies Input;
export const exampleOutput = {
  tSquared: [0, 4, 16],
  outlierIndexes: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/hotelling-t2-outlier",
  title: "Hotelling T2 Outlier",
  description:
    "Detect PCA outliers by covariance-adjusted Hotelling T², not Euclidean radius.",
  inputs: [
    { id: "pcOne", kind: "numberList", label: "Pc one" },
    { id: "pcTwo", kind: "numberList", label: "Pc two" },
    { id: "meanPcOne", kind: "number", label: "Mean pc one" },
    { id: "meanPcTwo", kind: "number", label: "Mean pc two" },
    { id: "covariance", kind: "matrix", label: "Covariance" },
    { id: "maximumT2", kind: "number", label: "Maximum t 2" },
  ],
  outputs: [
    { id: "tSquared", kind: "numberList", label: "T squared" },
    { id: "outlierIndexes", kind: "numberList", label: "Outlier indexes" },
  ],
  calculate: (value) =>
    calculate({
      pcOne: value.pcOne as readonly number[],
      pcTwo: value.pcTwo as readonly number[],
      meanPcOne: value.meanPcOne as number,
      meanPcTwo: value.meanPcTwo as number,
      covariance: value.covariance as readonly (readonly number[])[],
      maximumT2: value.maximumT2 as number,
    }),
});
export const run = tool.execute;
export default tool;
