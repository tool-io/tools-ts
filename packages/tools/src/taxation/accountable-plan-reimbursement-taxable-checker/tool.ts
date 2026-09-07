import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerAccountablePlanClassIds: readonly string[];
  readonly callerAccountablePlanRequiredEvidence: readonly (readonly number[])[];
  readonly observedAccountablePlanEvidence: readonly number[];
  readonly knownAccountablePlanEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAccountablePlanClassIds",
    label: "Caller accountable plan class ids",
    kind: "stringList",
  },
  {
    id: "callerAccountablePlanRequiredEvidence",
    label: "Caller accountable plan required evidence",
    kind: "matrix",
  },
  {
    id: "observedAccountablePlanEvidence",
    label: "Observed accountable plan evidence",
    kind: "numberList",
  },
  {
    id: "knownAccountablePlanEvidenceFlags",
    label: "Known accountable plan evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerAccountablePlanClassIds,
    input.callerAccountablePlanRequiredEvidence,
    input.observedAccountablePlanEvidence,
    input.knownAccountablePlanEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAccountablePlanClassIds: ["a", "b"],
  callerAccountablePlanRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedAccountablePlanEvidence: [1, 0],
  knownAccountablePlanEvidenceFlags: [1, 0],
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
  id: "taxation/accountable-plan-reimbursement-taxable-checker",
  title: "Accountable Plan Reimbursement Taxable Checker",
  description:
    "Caller independently evidenced business connection/substantiation/excess return conditions, not blanket reimbursement exclusion. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerAccountablePlanClassIds:
        value.callerAccountablePlanClassIds as readonly string[],
      callerAccountablePlanRequiredEvidence:
        value.callerAccountablePlanRequiredEvidence as readonly (readonly number[])[],
      observedAccountablePlanEvidence:
        value.observedAccountablePlanEvidence as readonly number[],
      knownAccountablePlanEvidenceFlags:
        value.knownAccountablePlanEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
