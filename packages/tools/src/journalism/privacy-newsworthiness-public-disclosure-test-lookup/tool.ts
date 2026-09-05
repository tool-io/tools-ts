import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPrivacyDisclosureClassIds: readonly string[];
  readonly callerPrivacyDisclosureRequirements: readonly (readonly number[])[];
  readonly observedPrivacyDisclosureEvidence: readonly number[];
  readonly knownPrivacyDisclosureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPrivacyDisclosureClassIds",
    label: "Caller privacy disclosure class ids",
    kind: "stringList",
  },
  {
    id: "callerPrivacyDisclosureRequirements",
    label: "Caller privacy disclosure requirements",
    kind: "matrix",
  },
  {
    id: "observedPrivacyDisclosureEvidence",
    label: "Observed privacy disclosure evidence",
    kind: "numberList",
  },
  {
    id: "knownPrivacyDisclosureFlags",
    label: "Known privacy disclosure flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPrivacyDisclosureClassIds,
    input.callerPrivacyDisclosureRequirements,
    input.observedPrivacyDisclosureEvidence,
    input.knownPrivacyDisclosureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPrivacyDisclosureClassIds: ["a", "b"],
  callerPrivacyDisclosureRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPrivacyDisclosureEvidence: [1, 0],
  knownPrivacyDisclosureFlags: [1, 0],
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
  id: "journalism/privacy-newsworthiness-public-disclosure-test-lookup",
  title: "Privacy Newsworthiness Public Disclosure Test Lookup",
  description:
    "Caller independently verified private-fact, public disclosure, offensiveness and newsworthiness legal-review evidence, not balancing checklist as clearance. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerPrivacyDisclosureClassIds:
        value.callerPrivacyDisclosureClassIds as readonly string[],
      callerPrivacyDisclosureRequirements:
        value.callerPrivacyDisclosureRequirements as readonly (readonly number[])[],
      observedPrivacyDisclosureEvidence:
        value.observedPrivacyDisclosureEvidence as readonly number[],
      knownPrivacyDisclosureFlags:
        value.knownPrivacyDisclosureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
