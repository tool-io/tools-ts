import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerPenaltyAbatementClassIds: readonly string[];
  readonly callerPenaltyAbatementRequiredEvidence: readonly (readonly number[])[];
  readonly observedPenaltyAbatementEvidence: readonly number[];
  readonly knownPenaltyAbatementEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPenaltyAbatementClassIds",
    label: "Caller penalty abatement class ids",
    kind: "stringList",
  },
  {
    id: "callerPenaltyAbatementRequiredEvidence",
    label: "Caller penalty abatement required evidence",
    kind: "matrix",
  },
  {
    id: "observedPenaltyAbatementEvidence",
    label: "Observed penalty abatement evidence",
    kind: "numberList",
  },
  {
    id: "knownPenaltyAbatementEvidenceFlags",
    label: "Known penalty abatement evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPenaltyAbatementClassIds,
    input.callerPenaltyAbatementRequiredEvidence,
    input.observedPenaltyAbatementEvidence,
    input.knownPenaltyAbatementEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPenaltyAbatementClassIds: ["a", "b"],
  callerPenaltyAbatementRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedPenaltyAbatementEvidence: [1, 0],
  knownPenaltyAbatementEvidenceFlags: [1, 0],
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
  id: "taxation/first-time-penalty-abatement-fta-eligibility-checker",
  title: "First Time Penalty Abatement FTA Eligibility Checker",
  description:
    "Caller independently verified filing/payment/history FTA criteria and known evidence, no approval guarantee. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerPenaltyAbatementClassIds:
        value.callerPenaltyAbatementClassIds as readonly string[],
      callerPenaltyAbatementRequiredEvidence:
        value.callerPenaltyAbatementRequiredEvidence as readonly (readonly number[])[],
      observedPenaltyAbatementEvidence:
        value.observedPenaltyAbatementEvidence as readonly number[],
      knownPenaltyAbatementEvidenceFlags:
        value.knownPenaltyAbatementEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
