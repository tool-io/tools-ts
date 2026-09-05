import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, contiguous } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly stepAges: readonly number[];
  readonly releasedArgonWeights: readonly number[];
  readonly callerMaxAgeSpan: number;
  readonly callerMinimumReleasedFraction: number;
}>;
export type Output = Readonly<{
  readonly observedPlateauStartIndex: number;
  readonly observedPlateauEndIndex: number;
  readonly observedPlateauWeightedAge: number;
  readonly noQualifyingPlateau: boolean;
}>;
const inputFields = [
  { id: "stepAges", label: "Step ages", kind: "numberList" },
  {
    id: "releasedArgonWeights",
    label: "Released argon weights",
    kind: "numberList",
  },
  { id: "callerMaxAgeSpan", label: "Caller max age span", kind: "number" },
  {
    id: "callerMinimumReleasedFraction",
    label: "Caller minimum released fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return contiguous(
    input.stepAges,
    input.releasedArgonWeights,
    input.callerMaxAgeSpan,
    input.callerMinimumReleasedFraction,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stepAges: [10, 10, 10, 20],
  releasedArgonWeights: [1, 1, 1, 1],
  callerMaxAgeSpan: 0,
  callerMinimumReleasedFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  observedPlateauStartIndex: 0,
  observedPlateauEndIndex: 2,
  observedPlateauWeightedAge: 10,
  noQualifyingPlateau: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/argon-argon-plateau-age",
  title: "Geology Argon Argon Plateau Age Calculator",
  description:
    "Bounded contiguous≥3-step observed plateau screen, independent maximum age-span and released-fraction policy; earliest maximum-weight tie, no statistical/geological plateau certification. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPlateauStartIndex",
      label: "Observed plateau start index",
      kind: "number",
    },
    {
      id: "observedPlateauEndIndex",
      label: "Observed plateau end index",
      kind: "number",
    },
    {
      id: "observedPlateauWeightedAge",
      label: "Observed plateau weighted age",
      kind: "number",
    },
    {
      id: "noQualifyingPlateau",
      label: "No qualifying plateau",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stepAges: value.stepAges as readonly number[],
      releasedArgonWeights: value.releasedArgonWeights as readonly number[],
      callerMaxAgeSpan: value.callerMaxAgeSpan as number,
      callerMinimumReleasedFraction:
        value.callerMinimumReleasedFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
