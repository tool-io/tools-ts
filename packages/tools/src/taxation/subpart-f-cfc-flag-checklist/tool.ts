import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerSubpartFCfcClassIds: readonly string[];
  readonly callerSubpartFCfcRequiredEvidence: readonly (readonly number[])[];
  readonly observedSubpartFCfcEvidence: readonly number[];
  readonly knownSubpartFCfcEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSubpartFCfcClassIds",
    label: "Caller subpart f cfc class ids",
    kind: "stringList",
  },
  {
    id: "callerSubpartFCfcRequiredEvidence",
    label: "Caller subpart f cfc required evidence",
    kind: "matrix",
  },
  {
    id: "observedSubpartFCfcEvidence",
    label: "Observed subpart f cfc evidence",
    kind: "numberList",
  },
  {
    id: "knownSubpartFCfcEvidenceFlags",
    label: "Known subpart f cfc evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerSubpartFCfcClassIds,
    input.callerSubpartFCfcRequiredEvidence,
    input.observedSubpartFCfcEvidence,
    input.knownSubpartFCfcEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSubpartFCfcClassIds: ["a", "b"],
  callerSubpartFCfcRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedSubpartFCfcEvidence: [1, 0],
  knownSubpartFCfcEvidenceFlags: [1, 0],
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
  id: "taxation/subpart-f-cfc-flag-checklist",
  title: "Subpart F CFC Flag Checklist",
  description:
    "Caller independently verified ownership/control/income-category SubpartF criteria, no CFC conclusion from one percent. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerSubpartFCfcClassIds:
        value.callerSubpartFCfcClassIds as readonly string[],
      callerSubpartFCfcRequiredEvidence:
        value.callerSubpartFCfcRequiredEvidence as readonly (readonly number[])[],
      observedSubpartFCfcEvidence:
        value.observedSubpartFCfcEvidence as readonly number[],
      knownSubpartFCfcEvidenceFlags:
        value.knownSubpartFCfcEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
