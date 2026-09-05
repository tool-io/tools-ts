import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerColdPoolDetachmentClassIds: readonly string[];
  readonly callerColdPoolDetachmentRequiredEvidence: readonly (readonly number[])[];
  readonly observedColdPoolDetachmentEvidence: readonly number[];
  readonly knownColdPoolDetachmentEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerColdPoolDetachmentClassIds",
    label: "Caller cold pool detachment class ids",
    kind: "stringList",
  },
  {
    id: "callerColdPoolDetachmentRequiredEvidence",
    label: "Caller cold pool detachment required evidence",
    kind: "matrix",
  },
  {
    id: "observedColdPoolDetachmentEvidence",
    label: "Observed cold pool detachment evidence",
    kind: "numberList",
  },
  {
    id: "knownColdPoolDetachmentEvidenceFlags",
    label: "Known cold pool detachment evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerColdPoolDetachmentClassIds,
    input.callerColdPoolDetachmentRequiredEvidence,
    input.observedColdPoolDetachmentEvidence,
    input.knownColdPoolDetachmentEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerColdPoolDetachmentClassIds: ["a", "b"],
  callerColdPoolDetachmentRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedColdPoolDetachmentEvidence: [1, 0],
  knownColdPoolDetachmentEvidenceFlags: [1, 0],
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
  id: "meteorology/cut-off-low-cold-pool-detachment-checker",
  title: "Cut Off Low Cold Pool Detachment Checker",
  description:
    "Independently traced closed/cutoff circulation and cold-pool detachment observations. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerColdPoolDetachmentClassIds:
        value.callerColdPoolDetachmentClassIds as readonly string[],
      callerColdPoolDetachmentRequiredEvidence:
        value.callerColdPoolDetachmentRequiredEvidence as readonly (readonly number[])[],
      observedColdPoolDetachmentEvidence:
        value.observedColdPoolDetachmentEvidence as readonly number[],
      knownColdPoolDetachmentEvidenceFlags:
        value.knownColdPoolDetachmentEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
