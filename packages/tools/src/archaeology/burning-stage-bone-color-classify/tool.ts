import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerBoneBurnColorClassIds: readonly string[];
  readonly callerBoneBurnColorRequirements: readonly (readonly number[])[];
  readonly observedBoneBurnColorEvidence: readonly number[];
  readonly knownBoneBurnColorFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerBoneBurnColorClassIds",
    label: "Caller bone burn color class ids",
    kind: "stringList",
  },
  {
    id: "callerBoneBurnColorRequirements",
    label: "Caller bone burn color requirements",
    kind: "matrix",
  },
  {
    id: "observedBoneBurnColorEvidence",
    label: "Observed bone burn color evidence",
    kind: "numberList",
  },
  {
    id: "knownBoneBurnColorFlags",
    label: "Known bone burn color flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerBoneBurnColorClassIds,
    input.callerBoneBurnColorRequirements,
    input.observedBoneBurnColorEvidence,
    input.knownBoneBurnColorFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBoneBurnColorClassIds: ["a", "b"],
  callerBoneBurnColorRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedBoneBurnColorEvidence: [1, 0],
  knownBoneBurnColorFlags: [1, 0],
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
  id: "archaeology/burning-stage-bone-color-classify",
  title: "Burning Stage Bone Color Classifier",
  description:
    "Independent observed bone color/mineral assay evidence against caller comparison criteria, not temperature or disease diagnosis. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
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
      callerBoneBurnColorClassIds:
        value.callerBoneBurnColorClassIds as readonly string[],
      callerBoneBurnColorRequirements:
        value.callerBoneBurnColorRequirements as readonly (readonly number[])[],
      observedBoneBurnColorEvidence:
        value.observedBoneBurnColorEvidence as readonly number[],
      knownBoneBurnColorFlags:
        value.knownBoneBurnColorFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
