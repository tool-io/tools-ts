import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerOpinionPrivilegeClassIds: readonly string[];
  readonly callerOpinionPrivilegeRequirements: readonly (readonly number[])[];
  readonly observedOpinionPrivilegeEvidence: readonly number[];
  readonly knownOpinionPrivilegeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerOpinionPrivilegeClassIds",
    label: "Caller opinion privilege class ids",
    kind: "stringList",
  },
  {
    id: "callerOpinionPrivilegeRequirements",
    label: "Caller opinion privilege requirements",
    kind: "matrix",
  },
  {
    id: "observedOpinionPrivilegeEvidence",
    label: "Observed opinion privilege evidence",
    kind: "numberList",
  },
  {
    id: "knownOpinionPrivilegeFlags",
    label: "Known opinion privilege flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerOpinionPrivilegeClassIds,
    input.callerOpinionPrivilegeRequirements,
    input.observedOpinionPrivilegeEvidence,
    input.knownOpinionPrivilegeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOpinionPrivilegeClassIds: ["a", "b"],
  callerOpinionPrivilegeRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedOpinionPrivilegeEvidence: [1, 0],
  knownOpinionPrivilegeFlags: [1, 0],
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
  id: "journalism/opinion-privilege-substantial-accuracy-checker",
  title: "Opinion Privilege Substantial Accuracy Checker",
  description:
    "Caller independently verified factual implication/context/accuracy and applicable privilege review evidence; opinion label alone not defamation immunity. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerOpinionPrivilegeClassIds:
        value.callerOpinionPrivilegeClassIds as readonly string[],
      callerOpinionPrivilegeRequirements:
        value.callerOpinionPrivilegeRequirements as readonly (readonly number[])[],
      observedOpinionPrivilegeEvidence:
        value.observedOpinionPrivilegeEvidence as readonly number[],
      knownOpinionPrivilegeFlags:
        value.knownOpinionPrivilegeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
