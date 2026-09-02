import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerBoneFractureStateClassIds: readonly string[];
  readonly callerBoneFractureStateRequirements: readonly (readonly number[])[];
  readonly observedBoneFractureStateEvidence: readonly number[];
  readonly knownBoneFractureStateFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerBoneFractureStateClassIds",
    label: "Caller bone fracture state class ids",
    kind: "stringList",
  },
  {
    id: "callerBoneFractureStateRequirements",
    label: "Caller bone fracture state requirements",
    kind: "matrix",
  },
  {
    id: "observedBoneFractureStateEvidence",
    label: "Observed bone fracture state evidence",
    kind: "numberList",
  },
  {
    id: "knownBoneFractureStateFlags",
    label: "Known bone fracture state flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerBoneFractureStateClassIds,
    input.callerBoneFractureStateRequirements,
    input.observedBoneFractureStateEvidence,
    input.knownBoneFractureStateFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBoneFractureStateClassIds: ["a", "b"],
  callerBoneFractureStateRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedBoneFractureStateEvidence: [1, 0],
  knownBoneFractureStateFlags: [1, 0],
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
  id: "archaeology/fracture-velocity-green-dry-classify",
  title: "Green/Dry Bone Fracture Velocity Classifier",
  description:
    "Independently measured fracture speed/morphology/moisture evidence against caller experimental green/dry classes, not postmortem interval. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
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
      callerBoneFractureStateClassIds:
        value.callerBoneFractureStateClassIds as readonly string[],
      callerBoneFractureStateRequirements:
        value.callerBoneFractureStateRequirements as readonly (readonly number[])[],
      observedBoneFractureStateEvidence:
        value.observedBoneFractureStateEvidence as readonly number[],
      knownBoneFractureStateFlags:
        value.knownBoneFractureStateFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
