import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedTotalProperMotionMasPerYear: number;
  readonly callerHighMotionThresholdMasPerYear: number;
}>;
export type Output = Readonly<{
  readonly callerHighMotionFlag: boolean;
  readonly signedThresholdDifferenceMasPerYear: number;
}>;
const inputFields = [
  {
    id: "observedTotalProperMotionMasPerYear",
    label: "Observed total proper motion mas per year",
    kind: "number",
  },
  {
    id: "callerHighMotionThresholdMasPerYear",
    label: "Caller high motion threshold mas per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerHighMotionThresholdMasPerYear,
    "callerHighMotionThresholdMasPerYear",
  );
  nonnegative(
    input.observedTotalProperMotionMasPerYear,
    "observedTotalProperMotionMasPerYear",
  );
  return {
    callerHighMotionFlag:
      input.observedTotalProperMotionMasPerYear >=
      input.callerHighMotionThresholdMasPerYear,
    signedThresholdDifferenceMasPerYear:
      input.observedTotalProperMotionMasPerYear -
      input.callerHighMotionThresholdMasPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTotalProperMotionMasPerYear: 180,
  callerHighMotionThresholdMasPerYear: 180,
} satisfies Input;
export const exampleOutput = {
  callerHighMotionFlag: true,
  signedThresholdDifferenceMasPerYear: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/high-proper-motion-flag-checker",
  title: "High Proper Motion Star Threshold 180 mas/yr Flag Checker",
  description:
    "Measured total angular-motion threshold screen, historical 180 title not immutable standard or source identity. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerHighMotionFlag",
      label: "Caller high motion flag",
      kind: "boolean",
    },
    {
      id: "signedThresholdDifferenceMasPerYear",
      label: "Signed threshold difference mas per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTotalProperMotionMasPerYear:
        value.observedTotalProperMotionMasPerYear as number,
      callerHighMotionThresholdMasPerYear:
        value.callerHighMotionThresholdMasPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
