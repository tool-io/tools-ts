import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerDividendQualificationClassIds: readonly string[];
  readonly callerDividendQualificationRequiredEvidence: readonly (readonly number[])[];
  readonly observedDividendQualificationEvidence: readonly number[];
  readonly knownDividendQualificationEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerDividendQualificationClassIds",
    label: "Caller dividend qualification class ids",
    kind: "stringList",
  },
  {
    id: "callerDividendQualificationRequiredEvidence",
    label: "Caller dividend qualification required evidence",
    kind: "matrix",
  },
  {
    id: "observedDividendQualificationEvidence",
    label: "Observed dividend qualification evidence",
    kind: "numberList",
  },
  {
    id: "knownDividendQualificationEvidenceFlags",
    label: "Known dividend qualification evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerDividendQualificationClassIds,
    input.callerDividendQualificationRequiredEvidence,
    input.observedDividendQualificationEvidence,
    input.knownDividendQualificationEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDividendQualificationClassIds: ["a", "b"],
  callerDividendQualificationRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedDividendQualificationEvidence: [1, 0],
  knownDividendQualificationEvidenceFlags: [1, 0],
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
  id: "taxation/qualified-dividend-ordinary-split-checker",
  title: "Qualified Dividend Ordinary Split Checker",
  description:
    "Caller independently evidenced issuer/holding-period/hedging qualified-dividend criteria; unknown observations retained. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerDividendQualificationClassIds:
        value.callerDividendQualificationClassIds as readonly string[],
      callerDividendQualificationRequiredEvidence:
        value.callerDividendQualificationRequiredEvidence as readonly (readonly number[])[],
      observedDividendQualificationEvidence:
        value.observedDividendQualificationEvidence as readonly number[],
      knownDividendQualificationEvidenceFlags:
        value.knownDividendQualificationEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
