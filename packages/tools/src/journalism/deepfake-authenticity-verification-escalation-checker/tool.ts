import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAuthenticityEscalationClassIds: readonly string[];
  readonly callerAuthenticityEscalationRequirements: readonly (readonly number[])[];
  readonly observedAuthenticityEscalationEvidence: readonly number[];
  readonly knownAuthenticityEscalationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAuthenticityEscalationClassIds",
    label: "Caller authenticity escalation class ids",
    kind: "stringList",
  },
  {
    id: "callerAuthenticityEscalationRequirements",
    label: "Caller authenticity escalation requirements",
    kind: "matrix",
  },
  {
    id: "observedAuthenticityEscalationEvidence",
    label: "Observed authenticity escalation evidence",
    kind: "numberList",
  },
  {
    id: "knownAuthenticityEscalationFlags",
    label: "Known authenticity escalation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerAuthenticityEscalationClassIds,
    input.callerAuthenticityEscalationRequirements,
    input.observedAuthenticityEscalationEvidence,
    input.knownAuthenticityEscalationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAuthenticityEscalationClassIds: ["a", "b"],
  callerAuthenticityEscalationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedAuthenticityEscalationEvidence: [1, 0],
  knownAuthenticityEscalationFlags: [1, 0],
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
  id: "journalism/deepfake-authenticity-verification-escalation-checker",
  title: "Deepfake Authenticity Verification Escalation Checker",
  description:
    "Caller independently observed provenance/consistency/verification indicators against escalation requirements; no deepfake detection or authentic verdict from absent indicators. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerAuthenticityEscalationClassIds:
        value.callerAuthenticityEscalationClassIds as readonly string[],
      callerAuthenticityEscalationRequirements:
        value.callerAuthenticityEscalationRequirements as readonly (readonly number[])[],
      observedAuthenticityEscalationEvidence:
        value.observedAuthenticityEscalationEvidence as readonly number[],
      knownAuthenticityEscalationFlags:
        value.knownAuthenticityEscalationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
