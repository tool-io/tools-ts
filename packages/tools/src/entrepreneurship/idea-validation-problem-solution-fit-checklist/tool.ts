import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerProblemSolutionFitClassIds: readonly string[];
  readonly callerProblemSolutionFitRequirements: readonly (readonly number[])[];
  readonly observedProblemSolutionFitEvidence: readonly number[];
  readonly knownProblemSolutionFitFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerProblemSolutionFitClassIds",
    label: "Caller problem solution fit class ids",
    kind: "stringList",
  },
  {
    id: "callerProblemSolutionFitRequirements",
    label: "Caller problem solution fit requirements",
    kind: "matrix",
  },
  {
    id: "observedProblemSolutionFitEvidence",
    label: "Observed problem solution fit evidence",
    kind: "numberList",
  },
  {
    id: "knownProblemSolutionFitFlags",
    label: "Known problem solution fit flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerProblemSolutionFitClassIds,
    input.callerProblemSolutionFitRequirements,
    input.observedProblemSolutionFitEvidence,
    input.knownProblemSolutionFitFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerProblemSolutionFitClassIds: ["a", "b"],
  callerProblemSolutionFitRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedProblemSolutionFitEvidence: [1, 0],
  knownProblemSolutionFitFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/idea-validation-problem-solution-fit-checklist",
  title: "Idea Validation Problem Solution Fit Checklist",
  description:
    "Independently documented problem-severity/current-workaround/solution-test evidence vs caller fit checklist; no validated product-market fit. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerProblemSolutionFitClassIds:
        value.callerProblemSolutionFitClassIds as readonly string[],
      callerProblemSolutionFitRequirements:
        value.callerProblemSolutionFitRequirements as readonly (readonly number[])[],
      observedProblemSolutionFitEvidence:
        value.observedProblemSolutionFitEvidence as readonly number[],
      knownProblemSolutionFitFlags:
        value.knownProblemSolutionFitFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
