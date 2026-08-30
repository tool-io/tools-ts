import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly originalTaggedSeedlingCount: number;
  readonly confirmedAliveCount: number;
  readonly confirmedDeadCount: number;
  readonly unlocatedTaggedCount: number;
}>;
export type Output = Readonly<{
  readonly observedAliveFractionAmongLocated: number;
  readonly wholeCohortSurvivalFractionBounds: readonly number[];
  readonly unlocatedCohortFraction: number;
}>;
const inputFields = [
  {
    id: "originalTaggedSeedlingCount",
    label: "Original tagged seedling count",
    kind: "integer",
  },
  {
    id: "confirmedAliveCount",
    label: "Confirmed alive count",
    kind: "integer",
  },
  { id: "confirmedDeadCount", label: "Confirmed dead count", kind: "integer" },
  {
    id: "unlocatedTaggedCount",
    label: "Unlocated tagged count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.originalTaggedSeedlingCount, "originalTaggedSeedlingCount");
  count(input.originalTaggedSeedlingCount, "originalTaggedSeedlingCount");
  count(input.confirmedAliveCount, "confirmedAliveCount");
  count(input.confirmedDeadCount, "confirmedDeadCount");
  count(input.unlocatedTaggedCount, "unlocatedTaggedCount");
  if (
    input.confirmedAliveCount +
      input.confirmedDeadCount +
      input.unlocatedTaggedCount !==
    input.originalTaggedSeedlingCount
  )
    simpleError(
      "cohort",
      "Alive, dead and unlocated counts must exhaust original tagged cohort.",
    );
  return {
    observedAliveFractionAmongLocated:
      input.confirmedAliveCount /
      positive(input.confirmedAliveCount + input.confirmedDeadCount, "located"),
    wholeCohortSurvivalFractionBounds: [
      input.confirmedAliveCount / input.originalTaggedSeedlingCount,
      (input.confirmedAliveCount + input.unlocatedTaggedCount) /
        input.originalTaggedSeedlingCount,
    ],
    unlocatedCohortFraction:
      input.unlocatedTaggedCount / input.originalTaggedSeedlingCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalTaggedSeedlingCount: 100,
  confirmedAliveCount: 70,
  confirmedDeadCount: 20,
  unlocatedTaggedCount: 10,
} satisfies Input;
export const exampleOutput = {
  observedAliveFractionAmongLocated: 0.7777777777777778,
  wholeCohortSurvivalFractionBounds: [0.7, 0.8],
  unlocatedCohortFraction: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/seedling-survival-first-season-percent",
  title: "First Season Seedling Survival Percent",
  description:
    "Separate first-season tagged survival among located seedlings from whole-cohort bounds for unlocated tags; missing plants are not forced dead or alive.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAliveFractionAmongLocated",
      label: "Observed alive fraction among located",
      kind: "number",
    },
    {
      id: "wholeCohortSurvivalFractionBounds",
      label: "Whole cohort survival fraction bounds",
      kind: "numberList",
    },
    {
      id: "unlocatedCohortFraction",
      label: "Unlocated cohort fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originalTaggedSeedlingCount: value.originalTaggedSeedlingCount as number,
      confirmedAliveCount: value.confirmedAliveCount as number,
      confirmedDeadCount: value.confirmedDeadCount as number,
      unlocatedTaggedCount: value.unlocatedTaggedCount as number,
    }),
});
export const run = tool.execute;
export default tool;
