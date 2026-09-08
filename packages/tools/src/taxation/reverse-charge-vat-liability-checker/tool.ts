import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerReverseChargeClassIds: readonly string[];
  readonly callerReverseChargeRequiredEvidence: readonly (readonly number[])[];
  readonly observedReverseChargeEvidence: readonly number[];
  readonly knownReverseChargeEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerReverseChargeClassIds",
    label: "Caller reverse charge class ids",
    kind: "stringList",
  },
  {
    id: "callerReverseChargeRequiredEvidence",
    label: "Caller reverse charge required evidence",
    kind: "matrix",
  },
  {
    id: "observedReverseChargeEvidence",
    label: "Observed reverse charge evidence",
    kind: "numberList",
  },
  {
    id: "knownReverseChargeEvidenceFlags",
    label: "Known reverse charge evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerReverseChargeClassIds,
    input.callerReverseChargeRequiredEvidence,
    input.observedReverseChargeEvidence,
    input.knownReverseChargeEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReverseChargeClassIds: ["a", "b"],
  callerReverseChargeRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedReverseChargeEvidence: [1, 0],
  knownReverseChargeEvidenceFlags: [1, 0],
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
  id: "taxation/reverse-charge-vat-liability-checker",
  title: "Reverse Charge VAT Liability Checker",
  description:
    "Caller transaction/jurisdiction/date verified reverse-charge criteria, obligation not inferred from place-name. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerReverseChargeClassIds:
        value.callerReverseChargeClassIds as readonly string[],
      callerReverseChargeRequiredEvidence:
        value.callerReverseChargeRequiredEvidence as readonly (readonly number[])[],
      observedReverseChargeEvidence:
        value.observedReverseChargeEvidence as readonly number[],
      knownReverseChargeEvidenceFlags:
        value.knownReverseChargeEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
