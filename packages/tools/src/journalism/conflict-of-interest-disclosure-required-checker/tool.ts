import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerConflictDisclosureClassIds: readonly string[];
  readonly callerConflictDisclosureRequirements: readonly (readonly number[])[];
  readonly observedConflictDisclosureEvidence: readonly number[];
  readonly knownConflictDisclosureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerConflictDisclosureClassIds",
    label: "Caller conflict disclosure class ids",
    kind: "stringList",
  },
  {
    id: "callerConflictDisclosureRequirements",
    label: "Caller conflict disclosure requirements",
    kind: "matrix",
  },
  {
    id: "observedConflictDisclosureEvidence",
    label: "Observed conflict disclosure evidence",
    kind: "numberList",
  },
  {
    id: "knownConflictDisclosureFlags",
    label: "Known conflict disclosure flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerConflictDisclosureClassIds,
    input.callerConflictDisclosureRequirements,
    input.observedConflictDisclosureEvidence,
    input.knownConflictDisclosureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerConflictDisclosureClassIds: ["a", "b"],
  callerConflictDisclosureRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedConflictDisclosureEvidence: [1, 0],
  knownConflictDisclosureFlags: [1, 0],
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
  id: "journalism/conflict-of-interest-disclosure-required-checker",
  title: "Conflict of Interest Disclosure Required Checker",
  description:
    "Caller independently verified assignment/financial/personal conflict disclosure criteria; missing disclosure evidence is not proven concealment. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerConflictDisclosureClassIds:
        value.callerConflictDisclosureClassIds as readonly string[],
      callerConflictDisclosureRequirements:
        value.callerConflictDisclosureRequirements as readonly (readonly number[])[],
      observedConflictDisclosureEvidence:
        value.observedConflictDisclosureEvidence as readonly number[],
      knownConflictDisclosureFlags:
        value.knownConflictDisclosureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
