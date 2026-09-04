import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerMouseAnchoredPostureClassIds: readonly string[];
  readonly callerMouseAnchoredPostureRequiredEvidence: readonly (readonly number[])[];
  readonly observedMouseAnchoredPostureEvidence: readonly number[];
  readonly knownMouseAnchoredPostureEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerMouseAnchoredPostureClassIds",
    label: "Caller mouse anchored posture class ids",
    kind: "stringList",
  },
  {
    id: "callerMouseAnchoredPostureRequiredEvidence",
    label: "Caller mouse anchored posture required evidence",
    kind: "matrix",
  },
  {
    id: "observedMouseAnchoredPostureEvidence",
    label: "Observed mouse anchored posture evidence",
    kind: "numberList",
  },
  {
    id: "knownMouseAnchoredPostureEvidenceFlags",
    label: "Known mouse anchored posture evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerMouseAnchoredPostureClassIds,
    input.callerMouseAnchoredPostureRequiredEvidence,
    input.observedMouseAnchoredPostureEvidence,
    input.knownMouseAnchoredPostureEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMouseAnchoredPostureClassIds: ["a", "b"],
  callerMouseAnchoredPostureRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedMouseAnchoredPostureEvidence: [1, 0],
  knownMouseAnchoredPostureEvidenceFlags: [1, 0],
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
  id: "ergonomics/mouse-anchor-risk-flag-checker",
  title: "Mouse Elbow Anchored Movement Risk Flag Checker",
  description:
    "Evidence screen for actual anchored elbow/mouse movement pattern against caller independent posture criteria, no causal injury assessment. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerMouseAnchoredPostureClassIds:
        value.callerMouseAnchoredPostureClassIds as readonly string[],
      callerMouseAnchoredPostureRequiredEvidence:
        value.callerMouseAnchoredPostureRequiredEvidence as readonly (readonly number[])[],
      observedMouseAnchoredPostureEvidence:
        value.observedMouseAnchoredPostureEvidence as readonly number[],
      knownMouseAnchoredPostureEvidenceFlags:
        value.knownMouseAnchoredPostureEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
