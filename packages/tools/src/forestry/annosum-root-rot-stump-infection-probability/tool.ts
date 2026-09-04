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
  bounded,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAssessedStumpCounts: readonly number[];
  readonly observedInfectedStumpCounts: readonly number[];
  readonly callerUnassessedStumpCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAssessedStumpInfectionFraction: number;
  readonly wholeStumpInfectionLowerBound: number;
  readonly wholeStumpInfectionUpperBound: number;
}>;
const inputFields = [
  {
    id: "observedAssessedStumpCounts",
    label: "Observed assessed stump counts",
    kind: "numberList",
  },
  {
    id: "observedInfectedStumpCounts",
    label: "Observed infected stump counts",
    kind: "numberList",
  },
  {
    id: "callerUnassessedStumpCounts",
    label: "Caller unassessed stump counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.observedAssessedStumpCounts,
    input.observedInfectedStumpCounts,
    input.callerUnassessedStumpCounts,
  ])
    v.forEach((x) => bounded(x, "count", 0, 1000000));
  aligned(
    input.observedAssessedStumpCounts,
    input.observedInfectedStumpCounts,
    "stumps",
  );
  aligned(
    input.observedAssessedStumpCounts,
    input.callerUnassessedStumpCounts,
    "unknown",
  );
  input.observedInfectedStumpCounts.forEach((v, i) => {
    if (v > input.observedAssessedStumpCounts[i])
      simpleError("infected", "Infected≤assessed stumps.");
  });
  const assessed = sum(input.observedAssessedStumpCounts),
    infected = sum(input.observedInfectedStumpCounts),
    unknown = sum(input.callerUnassessedStumpCounts);
  positive(assessed, "assessed");
  return {
    observedAssessedStumpInfectionFraction: infected / assessed,
    wholeStumpInfectionLowerBound: infected / (assessed + unknown),
    wholeStumpInfectionUpperBound: (infected + unknown) / (assessed + unknown),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAssessedStumpCounts: [10, 20],
  observedInfectedStumpCounts: [1, 4],
  callerUnassessedStumpCounts: [2, 3],
} satisfies Input;
export const exampleOutput = {
  observedAssessedStumpInfectionFraction: 0.16666666666666666,
  wholeStumpInfectionLowerBound: 0.14285714285714285,
  wholeStumpInfectionUpperBound: 0.2857142857142857,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/annosum-root-rot-stump-infection-probability",
  title: "Heterobasidion Stump Infection Probability Calculator",
  description:
    "Summarize independently identified Heterobasidion stump infection observations with unknown bounds, not predicted pathogen infection probability or treatment instructions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAssessedStumpInfectionFraction",
      label: "Observed assessed stump infection fraction",
      kind: "number",
    },
    {
      id: "wholeStumpInfectionLowerBound",
      label: "Whole stump infection lower bound",
      kind: "number",
    },
    {
      id: "wholeStumpInfectionUpperBound",
      label: "Whole stump infection upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAssessedStumpCounts:
        value.observedAssessedStumpCounts as readonly number[],
      observedInfectedStumpCounts:
        value.observedInfectedStumpCounts as readonly number[],
      callerUnassessedStumpCounts:
        value.callerUnassessedStumpCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
