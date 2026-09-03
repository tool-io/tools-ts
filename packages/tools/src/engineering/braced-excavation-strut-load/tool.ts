import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedAverageStrutPressurePa: number;
  readonly tributaryVerticalHeightM: number;
  readonly strutHorizontalSpacingM: number;
  readonly callerLoadSharingFraction: number;
}>;
export type Output = Readonly<{ readonly tributaryStrutDemandN: number }>;
const inputFields = [
  {
    id: "callerMatchedAverageStrutPressurePa",
    label: "Caller matched average strut pressure pa",
    kind: "number",
  },
  {
    id: "tributaryVerticalHeightM",
    label: "Tributary vertical height m",
    kind: "number",
  },
  {
    id: "strutHorizontalSpacingM",
    label: "Strut horizontal spacing m",
    kind: "number",
  },
  {
    id: "callerLoadSharingFraction",
    label: "Caller load sharing fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tributaryVerticalHeightM, "tributaryVerticalHeightM");
  positive(input.strutHorizontalSpacingM, "strutHorizontalSpacingM");
  nonnegative(
    input.callerMatchedAverageStrutPressurePa,
    "callerMatchedAverageStrutPressurePa",
  );
  fraction(input.callerLoadSharingFraction, "callerLoadSharingFraction");
  return {
    tributaryStrutDemandN:
      input.callerMatchedAverageStrutPressurePa *
      input.tributaryVerticalHeightM *
      input.strutHorizontalSpacingM *
      input.callerLoadSharingFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedAverageStrutPressurePa: 10,
  tributaryVerticalHeightM: 2,
  strutHorizontalSpacingM: 3,
  callerLoadSharingFraction: 0.5,
} satisfies Input;
export const exampleOutput = { tributaryStrutDemandN: 30 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/braced-excavation-strut-load",
  title: "Braced Excavation Strut Load Calculator",
  description:
    "Strut tributary area load and independently established sharing, not pressure prediction or strut capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "tributaryStrutDemandN",
      label: "Tributary strut demand n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedAverageStrutPressurePa:
        value.callerMatchedAverageStrutPressurePa as number,
      tributaryVerticalHeightM: value.tributaryVerticalHeightM as number,
      strutHorizontalSpacingM: value.strutHorizontalSpacingM as number,
      callerLoadSharingFraction: value.callerLoadSharingFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
