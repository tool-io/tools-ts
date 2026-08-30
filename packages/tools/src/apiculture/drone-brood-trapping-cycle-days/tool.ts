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
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly cappedBroodAgesDays: readonly number[];
  readonly earliestRemovalAgeDays: number;
  readonly earliestModelEmergenceAgeDays: number;
  readonly emergenceLeadDays: number;
}>;
export type Output = Readonly<{
  readonly cohortInterceptionWindowsDays: readonly (readonly number[])[];
  readonly commonInterceptionWindowDays: readonly number[];
}>;
const inputFields = [
  {
    id: "cappedBroodAgesDays",
    label: "Capped brood ages days",
    kind: "numberList",
  },
  {
    id: "earliestRemovalAgeDays",
    label: "Earliest removal age days",
    kind: "number",
  },
  {
    id: "earliestModelEmergenceAgeDays",
    label: "Earliest model emergence age days",
    kind: "number",
  },
  { id: "emergenceLeadDays", label: "Emergence lead days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.earliestModelEmergenceAgeDays,
    "earliestModelEmergenceAgeDays",
  );
  input.cappedBroodAgesDays.forEach((v) =>
    nonnegative(v, "cappedBroodAgesDays"),
  );
  nonnegative(input.earliestRemovalAgeDays, "earliestRemovalAgeDays");
  nonnegative(input.emergenceLeadDays, "emergenceLeadDays");
  if (
    !input.cappedBroodAgesDays.length ||
    input.cappedBroodAgesDays.length > 128
  )
    simpleError("cappedBroodAgesDays", "1–128 cohorts supported.");
  const cohortInterceptionWindowsDays = input.cappedBroodAgesDays.map((age) => [
      Math.max(0, input.earliestRemovalAgeDays - age),
      input.earliestModelEmergenceAgeDays - input.emergenceLeadDays - age,
    ]),
    lo = maximum(cohortInterceptionWindowsDays.map((row) => row[0])),
    hi = minimum(cohortInterceptionWindowsDays.map((row) => row[1]));
  if (hi < lo)
    simpleError(
      "cappedBroodAgesDays",
      "No common nonnegative interception window under supplied biology assumptions.",
    );
  return {
    cohortInterceptionWindowsDays,
    commonInterceptionWindowDays: [lo, hi],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cappedBroodAgesDays: [10, 12],
  earliestRemovalAgeDays: 14,
  earliestModelEmergenceAgeDays: 24,
  emergenceLeadDays: 2,
} satisfies Input;
export const exampleOutput = {
  cohortInterceptionWindowsDays: [
    [4, 12],
    [2, 10],
  ],
  commonInterceptionWindowDays: [4, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/drone-brood-trapping-cycle-days",
  title: "Drone Brood Trapping Cycle Days",
  description:
    "Intersect caller removal/emergence windows for observed capped drone-brood cohorts; describes a timing scenario only, not a validated mite-control schedule or efficacy claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "cohortInterceptionWindowsDays",
      label: "Cohort interception windows days",
      kind: "matrix",
    },
    {
      id: "commonInterceptionWindowDays",
      label: "Common interception window days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      cappedBroodAgesDays: value.cappedBroodAgesDays as readonly number[],
      earliestRemovalAgeDays: value.earliestRemovalAgeDays as number,
      earliestModelEmergenceAgeDays:
        value.earliestModelEmergenceAgeDays as number,
      emergenceLeadDays: value.emergenceLeadDays as number,
    }),
});
export const run = tool.execute;
export default tool;
