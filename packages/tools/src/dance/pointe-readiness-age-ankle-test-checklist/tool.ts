import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPointeAssessmentClassIds: readonly string[];
  readonly callerPointeAssessmentRequirements: readonly (readonly number[])[];
  readonly observedPointeAssessmentEvidence: readonly number[];
  readonly knownPointeAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPointeAssessmentClassIds",
    label: "Caller pointe assessment class ids",
    kind: "stringList",
  },
  {
    id: "callerPointeAssessmentRequirements",
    label: "Caller pointe assessment requirements",
    kind: "matrix",
  },
  {
    id: "observedPointeAssessmentEvidence",
    label: "Observed pointe assessment evidence",
    kind: "numberList",
  },
  {
    id: "knownPointeAssessmentFlags",
    label: "Known pointe assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPointeAssessmentClassIds,
    input.callerPointeAssessmentRequirements,
    input.observedPointeAssessmentEvidence,
    input.knownPointeAssessmentFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPointeAssessmentClassIds: ["a", "b"],
  callerPointeAssessmentRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPointeAssessmentEvidence: [1, 0],
  knownPointeAssessmentFlags: [1, 0],
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
  id: "dance/pointe-readiness-age-ankle-test-checklist",
  title: "Pointe Readiness Age Ankle Test Checklist",
  description:
    "Caller independently qualified in-person assessment criteria/evidence with missing checks retained; age/ankle checklist does not authorize pointe training. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerPointeAssessmentClassIds:
        value.callerPointeAssessmentClassIds as readonly string[],
      callerPointeAssessmentRequirements:
        value.callerPointeAssessmentRequirements as readonly (readonly number[])[],
      observedPointeAssessmentEvidence:
        value.observedPointeAssessmentEvidence as readonly number[],
      knownPointeAssessmentFlags:
        value.knownPointeAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
