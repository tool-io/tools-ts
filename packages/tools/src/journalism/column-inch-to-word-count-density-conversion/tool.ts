import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
  bounded,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly measuredSampleColumnInches: number;
  readonly measuredSampleWordCount: number;
  readonly targetColumnInches: readonly number[];
  readonly callerCopyWords: number;
}>;
export type Output = Readonly<{
  readonly calibratedWordsPerColumnInch: number;
  readonly targetEstimatedWordCapacities: readonly number[];
  readonly totalEstimatedWordCapacity: number;
  readonly signedCopyWordOverflow: number;
}>;
const inputFields = [
  {
    id: "measuredSampleColumnInches",
    label: "Measured sample column inches",
    kind: "number",
  },
  {
    id: "measuredSampleWordCount",
    label: "Measured sample word count",
    kind: "number",
  },
  {
    id: "targetColumnInches",
    label: "Target column inches",
    kind: "numberList",
  },
  { id: "callerCopyWords", label: "Caller copy words", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredSampleColumnInches, "measuredSampleColumnInches");
  input.targetColumnInches.forEach((v) => nonnegative(v, "targetColumnInches"));
  bounded(input.measuredSampleWordCount, "sampleWords", 1, 10000000);
  bounded(input.callerCopyWords, "copyWords", 0, 10000000);
  const density =
      input.measuredSampleWordCount / input.measuredSampleColumnInches,
    capacities = input.targetColumnInches.map((v) => v * density),
    total = sum(capacities);
  return {
    calibratedWordsPerColumnInch: density,
    targetEstimatedWordCapacities: capacities,
    totalEstimatedWordCapacity: total,
    signedCopyWordOverflow: input.callerCopyWords - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSampleColumnInches: 5,
  measuredSampleWordCount: 1000,
  targetColumnInches: [2, 3],
  callerCopyWords: 1100,
} satisfies Input;
export const exampleOutput = {
  calibratedWordsPerColumnInch: 200,
  targetEstimatedWordCapacities: [400, 600],
  totalEstimatedWordCapacity: 1000,
  signedCopyWordOverflow: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/column-inch-to-word-count-density-conversion",
  title: "Column Inch to Word Count Density Conversion",
  description:
    "Calibrate actual typeset words per caller column-inch measure and estimate target capacity/overflow; not generic length conversion, universal typeface density or a guarantee after headings/photos/line wrapping change.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedWordsPerColumnInch",
      label: "Calibrated words per column inch",
      kind: "number",
    },
    {
      id: "targetEstimatedWordCapacities",
      label: "Target estimated word capacities",
      kind: "numberList",
    },
    {
      id: "totalEstimatedWordCapacity",
      label: "Total estimated word capacity",
      kind: "number",
    },
    {
      id: "signedCopyWordOverflow",
      label: "Signed copy word overflow",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSampleColumnInches: value.measuredSampleColumnInches as number,
      measuredSampleWordCount: value.measuredSampleWordCount as number,
      targetColumnInches: value.targetColumnInches as readonly number[],
      callerCopyWords: value.callerCopyWords as number,
    }),
});
export const run = tool.execute;
export default tool;
