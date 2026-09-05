import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerWearReviewClassIds: readonly string[];
  readonly callerWearReviewRequirements: readonly (readonly number[])[];
  readonly observedWearReviewEvidence: readonly number[];
  readonly knownWearReviewFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerWearReviewClassIds",
    label: "Caller wear review class ids",
    kind: "stringList",
  },
  {
    id: "callerWearReviewRequirements",
    label: "Caller wear review requirements",
    kind: "matrix",
  },
  {
    id: "observedWearReviewEvidence",
    label: "Observed wear review evidence",
    kind: "numberList",
  },
  {
    id: "knownWearReviewFlags",
    label: "Known wear review flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerWearReviewClassIds,
    input.callerWearReviewRequirements,
    input.observedWearReviewEvidence,
    input.knownWearReviewFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWearReviewClassIds: ["a", "b"],
  callerWearReviewRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedWearReviewEvidence: [1, 0],
  knownWearReviewFlags: [1, 0],
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
  id: "gemology/mohs-wear-suitability",
  title: "Mohs Interval Wear Suitability Checker",
  description:
    "Caller independently documented hardness/toughness/cleavage/exposure evidence against caller wearing-context review criteria, no Mohs-only safe suitability verdict. Independently declared positive evidence requirements; overlaps and unknowns retained. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      callerWearReviewClassIds:
        value.callerWearReviewClassIds as readonly string[],
      callerWearReviewRequirements:
        value.callerWearReviewRequirements as readonly (readonly number[])[],
      observedWearReviewEvidence:
        value.observedWearReviewEvidence as readonly number[],
      knownWearReviewFlags: value.knownWearReviewFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
