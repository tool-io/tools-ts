import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerRimingParticleClassIds: readonly string[];
  readonly callerRimingParticleRequiredEvidence: readonly (readonly number[])[];
  readonly observedRimingParticleEvidence: readonly number[];
  readonly knownRimingParticleEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRimingParticleClassIds",
    label: "Caller riming particle class ids",
    kind: "stringList",
  },
  {
    id: "callerRimingParticleRequiredEvidence",
    label: "Caller riming particle required evidence",
    kind: "matrix",
  },
  {
    id: "observedRimingParticleEvidence",
    label: "Observed riming particle evidence",
    kind: "numberList",
  },
  {
    id: "knownRimingParticleEvidenceFlags",
    label: "Known riming particle evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerRimingParticleClassIds,
    input.callerRimingParticleRequiredEvidence,
    input.observedRimingParticleEvidence,
    input.knownRimingParticleEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRimingParticleClassIds: ["a", "b"],
  callerRimingParticleRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedRimingParticleEvidence: [1, 0],
  knownRimingParticleEvidenceFlags: [1, 0],
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
  id: "meteorology/riming-degree-graupel-hail-split-checker",
  title: "Riming Degree Graupel Hail Split Checker",
  description:
    "Observed particle morphology/riming evidence against caller graupel/hail classes, no diameter-only species. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerRimingParticleClassIds:
        value.callerRimingParticleClassIds as readonly string[],
      callerRimingParticleRequiredEvidence:
        value.callerRimingParticleRequiredEvidence as readonly (readonly number[])[],
      observedRimingParticleEvidence:
        value.observedRimingParticleEvidence as readonly number[],
      knownRimingParticleEvidenceFlags:
        value.knownRimingParticleEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
