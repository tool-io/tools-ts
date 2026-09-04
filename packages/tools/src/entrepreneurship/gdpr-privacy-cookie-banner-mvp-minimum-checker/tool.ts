import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerPrivacyMvpClassIds: readonly string[];
  readonly callerPrivacyMvpRequirements: readonly (readonly number[])[];
  readonly observedPrivacyMvpEvidence: readonly number[];
  readonly knownPrivacyMvpFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPrivacyMvpClassIds",
    label: "Caller privacy mvp class ids",
    kind: "stringList",
  },
  {
    id: "callerPrivacyMvpRequirements",
    label: "Caller privacy mvp requirements",
    kind: "matrix",
  },
  {
    id: "observedPrivacyMvpEvidence",
    label: "Observed privacy mvp evidence",
    kind: "numberList",
  },
  {
    id: "knownPrivacyMvpFlags",
    label: "Known privacy mvp flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPrivacyMvpClassIds,
    input.callerPrivacyMvpRequirements,
    input.observedPrivacyMvpEvidence,
    input.knownPrivacyMvpFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPrivacyMvpClassIds: ["a", "b"],
  callerPrivacyMvpRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPrivacyMvpEvidence: [1, 0],
  knownPrivacyMvpFlags: [1, 0],
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
  id: "entrepreneurship/gdpr-privacy-cookie-banner-mvp-minimum-checker",
  title: "GDPR Privacy Cookie Banner Mvp Minimum Checker",
  description:
    "Caller independently verified applicable privacy/consent/data-handling checklist, no blanket GDPR minimum from cookie-banner presence. Independently declared positive requirements, overlapping/unknown classes retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerPrivacyMvpClassIds:
        value.callerPrivacyMvpClassIds as readonly string[],
      callerPrivacyMvpRequirements:
        value.callerPrivacyMvpRequirements as readonly (readonly number[])[],
      observedPrivacyMvpEvidence:
        value.observedPrivacyMvpEvidence as readonly number[],
      knownPrivacyMvpFlags: value.knownPrivacyMvpFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
