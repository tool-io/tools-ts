import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerWorkerClassificationClassIds: readonly string[];
  readonly callerWorkerClassificationRequiredEvidence: readonly (readonly number[])[];
  readonly observedWorkerClassificationEvidence: readonly number[];
  readonly knownWorkerClassificationEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerWorkerClassificationClassIds",
    label: "Caller worker classification class ids",
    kind: "stringList",
  },
  {
    id: "callerWorkerClassificationRequiredEvidence",
    label: "Caller worker classification required evidence",
    kind: "matrix",
  },
  {
    id: "observedWorkerClassificationEvidence",
    label: "Observed worker classification evidence",
    kind: "numberList",
  },
  {
    id: "knownWorkerClassificationEvidenceFlags",
    label: "Known worker classification evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerWorkerClassificationClassIds,
    input.callerWorkerClassificationRequiredEvidence,
    input.observedWorkerClassificationEvidence,
    input.knownWorkerClassificationEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWorkerClassificationClassIds: ["a", "b"],
  callerWorkerClassificationRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedWorkerClassificationEvidence: [1, 0],
  knownWorkerClassificationEvidenceFlags: [1, 0],
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
  id: "taxation/contractor-vs-employee-classification-test-checker",
  title: "Contractor vs Employee Classification Test Checker",
  description:
    "Caller jurisdiction/method independently required control/relationship indicators, no forced employee/contractor label from incomplete evidence. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerWorkerClassificationClassIds:
        value.callerWorkerClassificationClassIds as readonly string[],
      callerWorkerClassificationRequiredEvidence:
        value.callerWorkerClassificationRequiredEvidence as readonly (readonly number[])[],
      observedWorkerClassificationEvidence:
        value.observedWorkerClassificationEvidence as readonly number[],
      knownWorkerClassificationEvidenceFlags:
        value.knownWorkerClassificationEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
