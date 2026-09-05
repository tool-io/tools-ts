import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerIceAccretionClassIds: readonly string[];
  readonly callerIceAccretionRequiredEvidence: readonly (readonly number[])[];
  readonly observedIceAccretionEvidence: readonly number[];
  readonly knownIceAccretionEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerIceAccretionClassIds",
    label: "Caller ice accretion class ids",
    kind: "stringList",
  },
  {
    id: "callerIceAccretionRequiredEvidence",
    label: "Caller ice accretion required evidence",
    kind: "matrix",
  },
  {
    id: "observedIceAccretionEvidence",
    label: "Observed ice accretion evidence",
    kind: "numberList",
  },
  {
    id: "knownIceAccretionEvidenceFlags",
    label: "Known ice accretion evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerIceAccretionClassIds,
    input.callerIceAccretionRequiredEvidence,
    input.observedIceAccretionEvidence,
    input.knownIceAccretionEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIceAccretionClassIds: ["a", "b"],
  callerIceAccretionRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedIceAccretionEvidence: [1, 0],
  knownIceAccretionEvidenceFlags: [1, 0],
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
  id: "meteorology/rime-vs-clear-ice-accretion-type-checker",
  title: "Rime vs Clear Ice Accretion Type Checker",
  description:
    "Observed ice texture, liquid water/freezing evidence for rime/clear/mixed classes; ambiguity retained. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerIceAccretionClassIds:
        value.callerIceAccretionClassIds as readonly string[],
      callerIceAccretionRequiredEvidence:
        value.callerIceAccretionRequiredEvidence as readonly (readonly number[])[],
      observedIceAccretionEvidence:
        value.observedIceAccretionEvidence as readonly number[],
      knownIceAccretionEvidenceFlags:
        value.knownIceAccretionEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
