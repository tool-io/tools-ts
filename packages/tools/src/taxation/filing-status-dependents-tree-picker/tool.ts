import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerFilingStatusClassIds: readonly string[];
  readonly callerFilingStatusRequiredEvidence: readonly (readonly number[])[];
  readonly observedFilingStatusEvidence: readonly number[];
  readonly knownFilingStatusEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFilingStatusClassIds",
    label: "Caller filing status class ids",
    kind: "stringList",
  },
  {
    id: "callerFilingStatusRequiredEvidence",
    label: "Caller filing status required evidence",
    kind: "matrix",
  },
  {
    id: "observedFilingStatusEvidence",
    label: "Observed filing status evidence",
    kind: "numberList",
  },
  {
    id: "knownFilingStatusEvidenceFlags",
    label: "Known filing status evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFilingStatusClassIds,
    input.callerFilingStatusRequiredEvidence,
    input.observedFilingStatusEvidence,
    input.knownFilingStatusEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFilingStatusClassIds: ["a", "b"],
  callerFilingStatusRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedFilingStatusEvidence: [1, 0],
  knownFilingStatusEvidenceFlags: [1, 0],
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
  id: "taxation/filing-status-dependents-tree-picker",
  title: "Filing Status Dependents Tree Picker",
  description:
    "Caller verified marital/dependent/household evidence tree candidate requirements, overlaps retained, no legal filing-status determination. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerFilingStatusClassIds:
        value.callerFilingStatusClassIds as readonly string[],
      callerFilingStatusRequiredEvidence:
        value.callerFilingStatusRequiredEvidence as readonly (readonly number[])[],
      observedFilingStatusEvidence:
        value.observedFilingStatusEvidence as readonly number[],
      knownFilingStatusEvidenceFlags:
        value.knownFilingStatusEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
