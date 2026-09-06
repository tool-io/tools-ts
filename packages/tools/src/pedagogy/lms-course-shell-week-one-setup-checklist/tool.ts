import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerLmsReadinessClassIds: readonly string[];
  readonly callerLmsReadinessRequirements: readonly (readonly number[])[];
  readonly observedLmsReadinessEvidence: readonly number[];
  readonly knownLmsReadinessFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerLmsReadinessClassIds",
    label: "Caller lms readiness class ids",
    kind: "stringList",
  },
  {
    id: "callerLmsReadinessRequirements",
    label: "Caller lms readiness requirements",
    kind: "matrix",
  },
  {
    id: "observedLmsReadinessEvidence",
    label: "Observed lms readiness evidence",
    kind: "numberList",
  },
  {
    id: "knownLmsReadinessFlags",
    label: "Known lms readiness flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerLmsReadinessClassIds,
    input.callerLmsReadinessRequirements,
    input.observedLmsReadinessEvidence,
    input.knownLmsReadinessFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLmsReadinessClassIds: ["a", "b"],
  callerLmsReadinessRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedLmsReadinessEvidence: [1, 0],
  knownLmsReadinessFlags: [1, 0],
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
  id: "pedagogy/lms-course-shell-week-one-setup-checklist",
  title: "LMS Course Shell Week One Setup Checklist",
  description:
    "Caller independently verified course module/navigation/access/contact requirements, not LMS usability or learner access certification. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerLmsReadinessClassIds:
        value.callerLmsReadinessClassIds as readonly string[],
      callerLmsReadinessRequirements:
        value.callerLmsReadinessRequirements as readonly (readonly number[])[],
      observedLmsReadinessEvidence:
        value.observedLmsReadinessEvidence as readonly number[],
      knownLmsReadinessFlags: value.knownLmsReadinessFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
