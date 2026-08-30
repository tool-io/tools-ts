import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly baselineDbHl: readonly number[];
  readonly followupDbHl: readonly number[];
  readonly shiftCriterionDb: number;
}>;
export type Output = Readonly<{
  readonly shiftsDb: readonly number[];
  readonly criterionFrequenciesHz: readonly number[];
  readonly meanShiftDb: number;
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  { id: "baselineDbHl", label: "Baseline db hl", kind: "numberList" },
  { id: "followupDbHl", label: "Followup db hl", kind: "numberList" },
  { id: "shiftCriterionDb", label: "Shift criterion db", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.frequenciesHz, input.baselineDbHl, "frequenciesHz");
  aligned(input.frequenciesHz, input.followupDbHl, "frequenciesHz");
  ordered(input.frequenciesHz, "frequenciesHz");
  input.frequenciesHz.forEach((v) => positive(v, "frequenciesHz"));
  positive(input.shiftCriterionDb, "shiftCriterionDb");
  const shiftsDb = input.followupDbHl.map((v, i) => v - input.baselineDbHl[i]);
  return {
    shiftsDb,
    criterionFrequenciesHz: input.frequenciesHz.filter(
      (_, i) => shiftsDb[i] >= input.shiftCriterionDb,
    ),
    meanShiftDb: mean(shiftsDb),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [500, 1000, 2000],
  baselineDbHl: [10, 20, 30],
  followupDbHl: [15, 20, 45],
  shiftCriterionDb: 10,
} satisfies Input;
export const exampleOutput = {
  shiftsDb: [5, 0, 15],
  criterionFrequenciesHz: [2000],
  meanShiftDb: 6.666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/matched-audiogram-threshold-shifts",
  title: "Hearing Threshold Shift",
  description:
    "Compare frequency-matched baseline/follow-up audiograms and flag a supplied positive deterioration threshold; this is not an occupational standard-threshold-shift determination.",
  inputs: inputFields,
  outputs: [
    { id: "shiftsDb", label: "Shifts db", kind: "numberList" },
    {
      id: "criterionFrequenciesHz",
      label: "Criterion frequencies hz",
      kind: "numberList",
    },
    { id: "meanShiftDb", label: "Mean shift db", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      baselineDbHl: value.baselineDbHl as readonly number[],
      followupDbHl: value.followupDbHl as readonly number[],
      shiftCriterionDb: value.shiftCriterionDb as number,
    }),
});
export const run = tool.execute;
export default tool;
