import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  maximum,
  runs,
} from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerDryDayUpperThresholdMm: number;
}>;
export type Output = Readonly<{
  readonly longestConsecutiveDryDays: number;
  readonly dryRunStartIndices: readonly number[];
  readonly dryRunLengthsDays: readonly number[];
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerDryDayUpperThresholdMm",
    label: "Caller dry day upper threshold mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  nonnegative(
    input.callerDryDayUpperThresholdMm,
    "callerDryDayUpperThresholdMm",
  );
  if (!input.dailyPrecipitationMm.length)
    simpleError(
      "days",
      "Nonempty consecutive observed daily sequence required.",
    );
  const r = runs(
    input.dailyPrecipitationMm.map(
      (v) => v < input.callerDryDayUpperThresholdMm,
    ),
  );
  return {
    longestConsecutiveDryDays: r.lengths.length ? maximum(r.lengths) : 0,
    dryRunStartIndices: r.starts,
    dryRunLengthsDays: r.lengths,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 0, 2, 0, 3],
  callerDryDayUpperThresholdMm: 1,
} satisfies Input;
export const exampleOutput = {
  longestConsecutiveDryDays: 2,
  dryRunStartIndices: [0, 3],
  dryRunLengthsDays: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/consecutive-dry-days",
  title: "Consecutive Dry Days Counter",
  description:
    "Find complete dry runs in a caller gap-free observed daily sequence using strict precipitation below supplied threshold; endpoints may be truncated by observation coverage, not proven climate-season boundaries.",
  inputs: inputFields,
  outputs: [
    {
      id: "longestConsecutiveDryDays",
      label: "Longest consecutive dry days",
      kind: "number",
    },
    {
      id: "dryRunStartIndices",
      label: "Dry run start indices",
      kind: "numberList",
    },
    {
      id: "dryRunLengthsDays",
      label: "Dry run lengths days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerDryDayUpperThresholdMm:
        value.callerDryDayUpperThresholdMm as number,
    }),
});
export const run = tool.execute;
export default tool;
