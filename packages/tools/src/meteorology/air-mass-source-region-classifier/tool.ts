import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerAirMassSourceClassIds: readonly string[];
  readonly callerAirMassSourceRequiredEvidence: readonly (readonly number[])[];
  readonly observedAirMassSourceEvidence: readonly number[];
  readonly knownAirMassSourceEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAirMassSourceClassIds",
    label: "Caller air mass source class ids",
    kind: "stringList",
  },
  {
    id: "callerAirMassSourceRequiredEvidence",
    label: "Caller air mass source required evidence",
    kind: "matrix",
  },
  {
    id: "observedAirMassSourceEvidence",
    label: "Observed air mass source evidence",
    kind: "numberList",
  },
  {
    id: "knownAirMassSourceEvidenceFlags",
    label: "Known air mass source evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerAirMassSourceClassIds,
    input.callerAirMassSourceRequiredEvidence,
    input.observedAirMassSourceEvidence,
    input.knownAirMassSourceEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAirMassSourceClassIds: ["a", "b"],
  callerAirMassSourceRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedAirMassSourceEvidence: [1, 0],
  knownAirMassSourceEvidenceFlags: [1, 0],
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
  id: "meteorology/air-mass-source-region-classifier",
  title: "Air Mass Source Region Classifier",
  description:
    "Measured thermodynamic/moisture and independently trajectory-confirmed source-region evidence. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerAirMassSourceClassIds:
        value.callerAirMassSourceClassIds as readonly string[],
      callerAirMassSourceRequiredEvidence:
        value.callerAirMassSourceRequiredEvidence as readonly (readonly number[])[],
      observedAirMassSourceEvidence:
        value.observedAirMassSourceEvidence as readonly number[],
      knownAirMassSourceEvidenceFlags:
        value.knownAirMassSourceEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
