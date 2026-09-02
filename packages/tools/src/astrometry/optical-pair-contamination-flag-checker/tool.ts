import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPairContaminationClassIds: readonly string[];
  readonly callerPairContaminationRequirements: readonly (readonly number[])[];
  readonly observedPairContaminationEvidence: readonly number[];
  readonly knownPairContaminationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPairContaminationClassIds",
    label: "Caller pair contamination class ids",
    kind: "stringList",
  },
  {
    id: "callerPairContaminationRequirements",
    label: "Caller pair contamination requirements",
    kind: "matrix",
  },
  {
    id: "observedPairContaminationEvidence",
    label: "Observed pair contamination evidence",
    kind: "numberList",
  },
  {
    id: "knownPairContaminationFlags",
    label: "Known pair contamination flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerPairContaminationClassIds,
    input.callerPairContaminationRequirements,
    input.observedPairContaminationEvidence,
    input.knownPairContaminationFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPairContaminationClassIds: ["a", "b"],
  callerPairContaminationRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedPairContaminationEvidence: [1, 0],
  knownPairContaminationFlags: [1, 0],
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
  id: "astrometry/optical-pair-contamination-flag-checker",
  title: "Optical versus Physical Pair Background Contamination Flag Checker",
  description:
    "Caller independent parallax/motion/background-density observations vs declared optical/physical pair evidence criteria; no physical association established by angular proximity. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
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
      callerPairContaminationClassIds:
        value.callerPairContaminationClassIds as readonly string[],
      callerPairContaminationRequirements:
        value.callerPairContaminationRequirements as readonly (readonly number[])[],
      observedPairContaminationEvidence:
        value.observedPairContaminationEvidence as readonly number[],
      knownPairContaminationFlags:
        value.knownPairContaminationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
