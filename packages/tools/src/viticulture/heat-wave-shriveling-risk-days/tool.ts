import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, runs } from "../shared.js";
export type Input = Readonly<{
  readonly dailyMaximumTemperaturesC: readonly number[];
  readonly callerHeatThresholdC: number;
  readonly callerMinimumHeatRunDays: number;
}>;
export type Output = Readonly<{
  readonly qualifyingHeatSpellStartIndices: readonly number[];
  readonly qualifyingHeatSpellLengthsDays: readonly number[];
  readonly totalQualifyingHeatExposureDays: number;
}>;
const inputFields = [
  {
    id: "dailyMaximumTemperaturesC",
    label: "Daily maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "callerHeatThresholdC",
    label: "Caller heat threshold c",
    kind: "number",
  },
  {
    id: "callerMinimumHeatRunDays",
    label: "Caller minimum heat run days",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumHeatRunDays, "callerMinimumHeatRunDays");
  count(input.callerMinimumHeatRunDays, "callerMinimumHeatRunDays");
  if (!input.dailyMaximumTemperaturesC.length)
    simpleError("days", "Observed gap-free daily sequence required.");
  const r = runs(
    input.dailyMaximumTemperaturesC.map((v) => v > input.callerHeatThresholdC),
    input.callerMinimumHeatRunDays,
  );
  return {
    qualifyingHeatSpellStartIndices: r.starts,
    qualifyingHeatSpellLengthsDays: r.lengths,
    totalQualifyingHeatExposureDays: r.days,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMaximumTemperaturesC: [20, 40, 40, 20, 40],
  callerHeatThresholdC: 35,
  callerMinimumHeatRunDays: 2,
} satisfies Input;
export const exampleOutput = {
  qualifyingHeatSpellStartIndices: [1],
  qualifyingHeatSpellLengthsDays: [2],
  totalQualifyingHeatExposureDays: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/heat-wave-shriveling-risk-days",
  title: "Heat Wave Shriveling Risk Days",
  description:
    "Count caller heat-wave duration policy on observed maximum temperatures; not baseline-percentile WSDI, measured berry water loss or shriveling/damage diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingHeatSpellStartIndices",
      label: "Qualifying heat spell start indices",
      kind: "numberList",
    },
    {
      id: "qualifyingHeatSpellLengthsDays",
      label: "Qualifying heat spell lengths days",
      kind: "numberList",
    },
    {
      id: "totalQualifyingHeatExposureDays",
      label: "Total qualifying heat exposure days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMaximumTemperaturesC:
        value.dailyMaximumTemperaturesC as readonly number[],
      callerHeatThresholdC: value.callerHeatThresholdC as number,
      callerMinimumHeatRunDays: value.callerMinimumHeatRunDays as number,
    }),
});
export const run = tool.execute;
export default tool;
