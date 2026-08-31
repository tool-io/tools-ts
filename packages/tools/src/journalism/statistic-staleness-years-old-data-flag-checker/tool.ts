import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dateDay, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly statisticReferenceDates: readonly string[];
  readonly asOfCivilDate: string;
  readonly callerMaximumAgeCivilDays: number;
}>;
export type Output = Readonly<{
  readonly observedDataAgesCivilDays: readonly number[];
  readonly staleStatisticIndices: readonly number[];
  readonly futureReferenceStatisticIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "statisticReferenceDates",
    label: "Statistic reference dates",
    kind: "stringList",
  },
  { id: "asOfCivilDate", label: "As of civil date", kind: "string" },
  {
    id: "callerMaximumAgeCivilDays",
    label: "Caller maximum age civil days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumAgeCivilDays, "agePolicy", 0, 36600);
  const today = dateDay(input.asOfCivilDate),
    ages = input.statisticReferenceDates.map((d) => today - dateDay(d));
  return {
    observedDataAgesCivilDays: ages,
    staleStatisticIndices: ages.flatMap((v, i) =>
      v > input.callerMaximumAgeCivilDays ? [i] : [],
    ),
    futureReferenceStatisticIndices: ages.flatMap((v, i) => (v < 0 ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  statisticReferenceDates: ["2024-01-01", "2025-01-01"],
  asOfCivilDate: "2025-01-01",
  callerMaximumAgeCivilDays: 365,
} satisfies Input;
export const exampleOutput = {
  observedDataAgesCivilDays: [366, 0],
  staleStatisticIndices: [0],
  futureReferenceStatisticIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/statistic-staleness-years-old-data-flag-checker",
  title: "Statistic Staleness Years Old Data Flag Checker",
  description:
    "Audit actual statistic reference-date ages under caller civil-day staleness policy, preserving future dates separately; reference period is not publication date and no universal expiry or data-revision authenticity inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDataAgesCivilDays",
      label: "Observed data ages civil days",
      kind: "numberList",
    },
    {
      id: "staleStatisticIndices",
      label: "Stale statistic indices",
      kind: "numberList",
    },
    {
      id: "futureReferenceStatisticIndices",
      label: "Future reference statistic indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      statisticReferenceDates:
        value.statisticReferenceDates as readonly string[],
      asOfCivilDate: value.asOfCivilDate as string,
      callerMaximumAgeCivilDays: value.callerMaximumAgeCivilDays as number,
    }),
});
export const run = tool.execute;
export default tool;
