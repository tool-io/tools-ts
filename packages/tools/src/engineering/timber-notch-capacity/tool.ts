import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly timberGrossDepthM: number;
  readonly observedNotchDepthM: number;
  readonly timberWidthM: number;
  readonly callerMatchedNetSectionShearPa: number;
  readonly callerIndependentNotchReductionFraction: number;
}>;
export type Output = Readonly<{
  readonly callerReducedTimberNetShearN: number;
}>;
const inputFields = [
  { id: "timberGrossDepthM", label: "Timber gross depth m", kind: "number" },
  {
    id: "observedNotchDepthM",
    label: "Observed notch depth m",
    kind: "number",
  },
  { id: "timberWidthM", label: "Timber width m", kind: "number" },
  {
    id: "callerMatchedNetSectionShearPa",
    label: "Caller matched net section shear pa",
    kind: "number",
  },
  {
    id: "callerIndependentNotchReductionFraction",
    label: "Caller independent notch reduction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.timberGrossDepthM, "timberGrossDepthM");
  positive(input.timberWidthM, "timberWidthM");
  positive(
    input.callerMatchedNetSectionShearPa,
    "callerMatchedNetSectionShearPa",
  );
  nonnegative(input.observedNotchDepthM, "observedNotchDepthM");
  if (input.observedNotchDepthM >= input.timberGrossDepthM)
    simpleError("notch", "Positive remaining timber depth required.");
  fraction(
    input.callerIndependentNotchReductionFraction,
    "callerIndependentNotchReductionFraction",
  );
  return {
    callerReducedTimberNetShearN:
      (2 / 3) *
      input.timberWidthM *
      (input.timberGrossDepthM - input.observedNotchDepthM) *
      input.callerMatchedNetSectionShearPa *
      input.callerIndependentNotchReductionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timberGrossDepthM: 0.4,
  observedNotchDepthM: 0.1,
  timberWidthM: 0.2,
  callerMatchedNetSectionShearPa: 100,
  callerIndependentNotchReductionFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerReducedTimberNetShearN: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/timber-notch-capacity",
  title: "Timber Notch Capacity Calculator",
  description:
    "Nominal rectangular net shear after independently established notch reduction, no fracture stress or unverified timber-notch code factor. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReducedTimberNetShearN",
      label: "Caller reduced timber net shear n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timberGrossDepthM: value.timberGrossDepthM as number,
      observedNotchDepthM: value.observedNotchDepthM as number,
      timberWidthM: value.timberWidthM as number,
      callerMatchedNetSectionShearPa:
        value.callerMatchedNetSectionShearPa as number,
      callerIndependentNotchReductionFraction:
        value.callerIndependentNotchReductionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
