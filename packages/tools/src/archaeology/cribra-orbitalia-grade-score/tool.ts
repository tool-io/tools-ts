import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedObservedOrbitalLesionCoverage: readonly number[];
  readonly callerObservedOrbitalLesionCoverageLower: readonly number[];
  readonly callerObservedOrbitalLesionCoverageUpper: readonly number[];
  readonly knownObservedOrbitalLesionCoverageFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedOrbitalLesionCoverage",
    label: "Observed observed orbital lesion coverage",
    kind: "numberList",
  },
  {
    id: "callerObservedOrbitalLesionCoverageLower",
    label: "Caller observed orbital lesion coverage lower",
    kind: "numberList",
  },
  {
    id: "callerObservedOrbitalLesionCoverageUpper",
    label: "Caller observed orbital lesion coverage upper",
    kind: "numberList",
  },
  {
    id: "knownObservedOrbitalLesionCoverageFlags",
    label: "Known observed orbital lesion coverage flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedOrbitalLesionCoverage,
    input.callerObservedOrbitalLesionCoverageLower,
    input.callerObservedOrbitalLesionCoverageUpper,
    input.knownObservedOrbitalLesionCoverageFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedOrbitalLesionCoverage: [2, 5],
  callerObservedOrbitalLesionCoverageLower: [1, 1],
  callerObservedOrbitalLesionCoverageUpper: [3, 4],
  knownObservedOrbitalLesionCoverageFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/cribra-orbitalia-grade-score",
  title: "Cribra Orbitalia Grade Score",
  description:
    "Independently observed orbital porosity lesion coverage against caller protocol grade bands; not anemia, nutritional diagnosis or lesion origin. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedObservedOrbitalLesionCoverage:
        value.observedObservedOrbitalLesionCoverage as readonly number[],
      callerObservedOrbitalLesionCoverageLower:
        value.callerObservedOrbitalLesionCoverageLower as readonly number[],
      callerObservedOrbitalLesionCoverageUpper:
        value.callerObservedOrbitalLesionCoverageUpper as readonly number[],
      knownObservedOrbitalLesionCoverageFlags:
        value.knownObservedOrbitalLesionCoverageFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
