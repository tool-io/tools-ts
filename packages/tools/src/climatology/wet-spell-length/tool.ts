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
  mean,
  runs,
} from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerWetDayLowerThresholdMm: number;
}>;
export type Output = Readonly<{
  readonly wetSpellStartIndices: readonly number[];
  readonly wetSpellLengthsDays: readonly number[];
  readonly meanWetSpellLengthDays: number;
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerWetDayLowerThresholdMm",
    label: "Caller wet day lower threshold mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWetDayLowerThresholdMm, "callerWetDayLowerThresholdMm");
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  if (!input.dailyPrecipitationMm.length)
    simpleError("days", "Nonempty daily sequence required.");
  const r = runs(
    input.dailyPrecipitationMm.map(
      (v) => v >= input.callerWetDayLowerThresholdMm,
    ),
  );
  return {
    wetSpellStartIndices: r.starts,
    wetSpellLengthsDays: r.lengths,
    meanWetSpellLengthDays: r.lengths.length ? mean(r.lengths) : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 2, 2, 0, 3],
  callerWetDayLowerThresholdMm: 1,
} satisfies Input;
export const exampleOutput = {
  wetSpellStartIndices: [1, 4],
  wetSpellLengthsDays: [2, 1],
  meanWetSpellLengthDays: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/wet-spell-length",
  title: "Wet Spell Length Analyzer",
  description:
    "Analyze full consecutive wet spell distribution at a caller inclusive precipitation threshold; supplied sequence must have no missing days and zero means no observed qualifying spell.",
  inputs: inputFields,
  outputs: [
    {
      id: "wetSpellStartIndices",
      label: "Wet spell start indices",
      kind: "numberList",
    },
    {
      id: "wetSpellLengthsDays",
      label: "Wet spell lengths days",
      kind: "numberList",
    },
    {
      id: "meanWetSpellLengthDays",
      label: "Mean wet spell length days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerWetDayLowerThresholdMm:
        value.callerWetDayLowerThresholdMm as number,
    }),
});
export const run = tool.execute;
export default tool;
