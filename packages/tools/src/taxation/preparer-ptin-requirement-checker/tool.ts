import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerPreparerPtinClassIds: readonly string[];
  readonly callerPreparerPtinRequiredEvidence: readonly (readonly number[])[];
  readonly observedPreparerPtinEvidence: readonly number[];
  readonly knownPreparerPtinEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPreparerPtinClassIds",
    label: "Caller preparer ptin class ids",
    kind: "stringList",
  },
  {
    id: "callerPreparerPtinRequiredEvidence",
    label: "Caller preparer ptin required evidence",
    kind: "matrix",
  },
  {
    id: "observedPreparerPtinEvidence",
    label: "Observed preparer ptin evidence",
    kind: "numberList",
  },
  {
    id: "knownPreparerPtinEvidenceFlags",
    label: "Known preparer ptin evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPreparerPtinClassIds,
    input.callerPreparerPtinRequiredEvidence,
    input.observedPreparerPtinEvidence,
    input.knownPreparerPtinEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPreparerPtinClassIds: ["a", "b"],
  callerPreparerPtinRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedPreparerPtinEvidence: [1, 0],
  knownPreparerPtinEvidenceFlags: [1, 0],
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
  id: "taxation/preparer-ptin-requirement-checker",
  title: "Preparer PTIN Requirement Checker",
  description:
    "Caller independently verified compensation/preparation/exception PTIN criteria, not legal duty from job title. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerPreparerPtinClassIds:
        value.callerPreparerPtinClassIds as readonly string[],
      callerPreparerPtinRequiredEvidence:
        value.callerPreparerPtinRequiredEvidence as readonly (readonly number[])[],
      observedPreparerPtinEvidence:
        value.observedPreparerPtinEvidence as readonly number[],
      knownPreparerPtinEvidenceFlags:
        value.knownPreparerPtinEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
