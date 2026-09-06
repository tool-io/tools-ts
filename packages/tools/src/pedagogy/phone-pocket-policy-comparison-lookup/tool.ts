import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPhonePolicyClassIds: readonly string[];
  readonly callerPhonePolicyRequirements: readonly (readonly number[])[];
  readonly observedPhonePolicyEvidence: readonly number[];
  readonly knownPhonePolicyFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPhonePolicyClassIds",
    label: "Caller phone policy class ids",
    kind: "stringList",
  },
  {
    id: "callerPhonePolicyRequirements",
    label: "Caller phone policy requirements",
    kind: "matrix",
  },
  {
    id: "observedPhonePolicyEvidence",
    label: "Observed phone policy evidence",
    kind: "numberList",
  },
  {
    id: "knownPhonePolicyFlags",
    label: "Known phone policy flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPhonePolicyClassIds,
    input.callerPhonePolicyRequirements,
    input.observedPhonePolicyEvidence,
    input.knownPhonePolicyFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPhonePolicyClassIds: ["a", "b"],
  callerPhonePolicyRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPhonePolicyEvidence: [1, 0],
  knownPhonePolicyFlags: [1, 0],
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
  id: "pedagogy/phone-pocket-policy-comparison-lookup",
  title: "Phone Pocket Policy Comparison Lookup",
  description:
    "Caller independently verified device access/emergency/consent/instruction requirements for phone policy candidates, not universal phone pocket recommendation. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerPhonePolicyClassIds:
        value.callerPhonePolicyClassIds as readonly string[],
      callerPhonePolicyRequirements:
        value.callerPhonePolicyRequirements as readonly (readonly number[])[],
      observedPhonePolicyEvidence:
        value.observedPhonePolicyEvidence as readonly number[],
      knownPhonePolicyFlags: value.knownPhonePolicyFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
