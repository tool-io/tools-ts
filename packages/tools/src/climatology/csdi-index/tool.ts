import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  runs,
} from "../shared.js";

export type Input = Readonly<{
  readonly dailyExtremesC: readonly number[];
  readonly callerDayOfYearPercentileThresholdsC: readonly number[];
  readonly callerMinimumSpellDays: number;
}>;
export type Output = Readonly<{
  readonly qualifyingSpellStartIndices: readonly number[];
  readonly qualifyingSpellLengthsDays: readonly number[];
  readonly spellDurationIndexDays: number;
}>;
const inputFields = [
  { id: "dailyExtremesC", label: "Daily extremes c", kind: "numberList" },
  {
    id: "callerDayOfYearPercentileThresholdsC",
    label: "Caller day of year percentile thresholds c",
    kind: "numberList",
  },
  {
    id: "callerMinimumSpellDays",
    label: "Caller minimum spell days",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumSpellDays, "callerMinimumSpellDays");
  count(input.callerMinimumSpellDays, "callerMinimumSpellDays");
  aligned(
    input.dailyExtremesC,
    input.callerDayOfYearPercentileThresholdsC,
    "dailyExtremesC",
  );
  const r = runs(
    input.dailyExtremesC.map(
      (v, i) => v < input.callerDayOfYearPercentileThresholdsC[i],
    ),
    input.callerMinimumSpellDays,
  );
  return {
    qualifyingSpellStartIndices: r.starts,
    qualifyingSpellLengthsDays: r.lengths,
    spellDurationIndexDays: r.days,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyExtremesC: [20, 20, 5, 20],
  callerDayOfYearPercentileThresholdsC: [10, 10, 10, 10],
  callerMinimumSpellDays: 2,
} satisfies Input;
export const exampleOutput = {
  qualifyingSpellStartIndices: [],
  qualifyingSpellLengthsDays: [],
  spellDurationIndexDays: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/csdi-index",
  title: "Cold Spell Duration Index CSDI",
  description:
    "Calculate cold CSDI minimum-temperature spells against caller independently calibrated day-of-year percentiles with strict exceedance and minimum run; threshold ties excluded, gap-free coverage required.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingSpellStartIndices",
      label: "Qualifying spell start indices",
      kind: "numberList",
    },
    {
      id: "qualifyingSpellLengthsDays",
      label: "Qualifying spell lengths days",
      kind: "numberList",
    },
    {
      id: "spellDurationIndexDays",
      label: "Spell duration index days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyExtremesC: value.dailyExtremesC as readonly number[],
      callerDayOfYearPercentileThresholdsC:
        value.callerDayOfYearPercentileThresholdsC as readonly number[],
      callerMinimumSpellDays: value.callerMinimumSpellDays as number,
    }),
});
export const run = tool.execute;
export default tool;
