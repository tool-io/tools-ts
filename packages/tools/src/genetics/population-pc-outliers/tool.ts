import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly sampleIds: readonly string[];
  readonly pc1Values: readonly number[];
  readonly referenceMean: number;
  readonly referenceSd: number;
  readonly maximumAbsoluteZ: number;
}>;
export type Output = Readonly<{
  readonly zScores: readonly number[];
  readonly outlierIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.sampleIds, input.pc1Values, "sampleIds");
  positive(input.referenceSd, "referenceSd");
  nonnegative(input.maximumAbsoluteZ, "maximumAbsoluteZ");
  const zScores = input.pc1Values.map(
    (v) => (v - input.referenceMean) / input.referenceSd,
  );
  return {
    zScores,
    outlierIds: input.sampleIds.filter(
      (_, i) => Math.abs(zScores[i]) > input.maximumAbsoluteZ,
    ),
  };
};
export const exampleInput = {
  sampleIds: ["A", "B", "C"],
  pc1Values: [0, 1, 5],
  referenceMean: 0,
  referenceSd: 1,
  maximumAbsoluteZ: 3,
} satisfies Input;
export const exampleOutput = {
  zScores: [0, 1, 5],
  outlierIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/population-pc-outliers",
  title: "Population PC Outliers",
  description:
    "Flag population-PC1 outliers relative to an explicitly supplied reference mean and standard deviation.",
  inputs: [
    { id: "sampleIds", label: "Sample ids", kind: "stringList" },
    { id: "pc1Values", label: "Pc 1 values", kind: "numberList" },
    { id: "referenceMean", label: "Reference mean", kind: "number" },
    { id: "referenceSd", label: "Reference sd", kind: "number" },
    { id: "maximumAbsoluteZ", label: "Maximum absolute z", kind: "number" },
  ],
  outputs: [
    { id: "zScores", label: "Z scores", kind: "numberList" },
    { id: "outlierIds", label: "Outlier ids", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      sampleIds: value.sampleIds as readonly string[],
      pc1Values: value.pc1Values as readonly number[],
      referenceMean: value.referenceMean as number,
      referenceSd: value.referenceSd as number,
      maximumAbsoluteZ: value.maximumAbsoluteZ as number,
    }),
});
export const run = tool.execute;
export default tool;
