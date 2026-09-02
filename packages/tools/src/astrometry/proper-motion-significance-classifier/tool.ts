import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedSignedComponentMasPerYear: number;
  readonly independentlyMeasuredSigmaMasPerYear: number;
  readonly callerAbsoluteSigmaReviewThreshold: number;
}>;
export type Output = Readonly<{
  readonly signedSignificance: number;
  readonly callerReviewThresholdReached: boolean;
}>;
const inputFields = [
  {
    id: "observedSignedComponentMasPerYear",
    label: "Observed signed component mas per year",
    kind: "number",
  },
  {
    id: "independentlyMeasuredSigmaMasPerYear",
    label: "Independently measured sigma mas per year",
    kind: "number",
  },
  {
    id: "callerAbsoluteSigmaReviewThreshold",
    label: "Caller absolute sigma review threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyMeasuredSigmaMasPerYear,
    "independentlyMeasuredSigmaMasPerYear",
  );
  positive(
    input.callerAbsoluteSigmaReviewThreshold,
    "callerAbsoluteSigmaReviewThreshold",
  );
  return {
    signedSignificance:
      input.observedSignedComponentMasPerYear /
      input.independentlyMeasuredSigmaMasPerYear,
    callerReviewThresholdReached:
      Math.abs(
        input.observedSignedComponentMasPerYear /
          input.independentlyMeasuredSigmaMasPerYear,
      ) >= input.callerAbsoluteSigmaReviewThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSignedComponentMasPerYear: -10,
  independentlyMeasuredSigmaMasPerYear: 2,
  callerAbsoluteSigmaReviewThreshold: 3,
} satisfies Input;
export const exampleOutput = {
  signedSignificance: -5,
  callerReviewThresholdReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/proper-motion-significance-classifier",
  title: "Proper Motion Significance Sigma per Year Classifier",
  description:
    "Single signed proper-motion component significance vs caller review threshold, not full 2 Dcovariance likelihood or astrophysical detection guarantee. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    { id: "signedSignificance", label: "Signed significance", kind: "number" },
    {
      id: "callerReviewThresholdReached",
      label: "Caller review threshold reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSignedComponentMasPerYear:
        value.observedSignedComponentMasPerYear as number,
      independentlyMeasuredSigmaMasPerYear:
        value.independentlyMeasuredSigmaMasPerYear as number,
      callerAbsoluteSigmaReviewThreshold:
        value.callerAbsoluteSigmaReviewThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
